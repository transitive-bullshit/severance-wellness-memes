import * as zlib from 'node:zlib'

import KeyvRedis from '@keyv/redis'
import debug from 'debug'
import Keyv from 'keyv'
import defaultKy, {
  type AfterResponseHook,
  type BeforeRequestHook,
  type KyInstance
} from 'ky'
import { OpenAIClient } from 'openai-fetch'
import pMemoize from 'p-memoize'

import type * as types from './types'
import * as config from './config'
import { normalizeUrl } from './url-utils'
import {
  assert,
  hashObject,
  pruneUndefined,
  trimMessage
  // trimMessage
} from './utils'

const debugKy = debug('ky')

const CACHE_HEADER = 'x-agentic-cache'
const MOCK_HEADER = 'x-agentic-mock'
const CACHE_RESPONSE_STATUS_KEY = 'x-agentic-status'
const cacheable4XXStatuses = new Set([400, 401, 403, 404])

if (config.isCI) {
  assert(!config.refreshCache, 'REFRESH_CACHE must be disabled in CI')
} else {
  assert(config.redisUrl, 'REDIS_URL is required')
}

export const keyv = new Keyv({
  store:
    config.redisUrl && !config.isCI
      ? new KeyvRedis(config.redisUrl)
      : undefined,
  namespace: config.redisNamespace
})

export const kyCacheStats: {
  hits: string[]
  misses: string[]
  skip: string[]
} = {
  hits: [],
  misses: [],
  skip: []
}

async function getCacheKeyForRequest(request: Request) {
  const normalizedUrl = normalizeUrl(request.url)
  if (!normalizedUrl) {
    return
  }

  const method = request.method.toLowerCase()
  const params: Record<string, any> = {}

  if (method !== 'get' && method !== 'head') {
    const domain = new URL(normalizedUrl).host

    if (method === 'post' && config.cacheDomainWhitelist.has(domain)) {
      // whitelisted POST requests for this domain
      try {
        params.body = await request.clone().json()
      } catch {
        return
      }
    } else {
      return
    }
  }

  params.headers = Object.fromEntries(request.headers.entries())
  const cacheKey = getCacheKey(`http:${method} ${normalizedUrl}`, params)

  // debugKy(
  //   'getCacheKeyForRequest',
  //   pruneUndefined({
  //     url: request.url,
  //     normalizedUrl: normalizedUrl === request.url ? undefined : normalizedUrl,
  //     headers: params.headers
  //   })
  // )

  return cacheKey
}

/**
 * Custom `ky` instance that caches GET JSON requests.
 *
 * TODO:
 *  - support non-GET requests
 *  - support non-JSON responses
 */
export function memoizeKy(ky: KyInstance = defaultKy): KyInstance {
  return ky.extend({
    hooks: {
      beforeRequest: [
        async (request) => {
          if (config.refreshCache) {
            // caching is disabled
            kyCacheStats.skip.push(getDebugInfo(request))
            return
          }

          if (isCachingDisabledForHeaders(request.headers as Headers)) {
            return
          }

          try {
            const cacheKey = await getCacheKeyForRequest(request)
            const normalizedUrl = normalizeUrl(request.url)
            if (!cacheKey) {
              kyCacheStats.skip.push(getDebugInfo(request))

              debugKy(
                'CACHE SKIP',
                pruneUndefined({
                  method: request.method,
                  url: request.url,
                  normalizedUrl:
                    normalizedUrl === request.url ? undefined : normalizedUrl,
                  cacheKey
                })
              )

              return
            }

            let cachedResponse = await keyv.get(cacheKey)
            if (!cachedResponse) {
              kyCacheStats.misses.push(getDebugInfo(request))

              debugKy('CACHE MISS', {
                method: request.method,
                url: request.url,
                cacheKey
              })

              return
            }

            cachedResponse = JSON.parse(
              zlib
                .brotliDecompressSync(Buffer.from(cachedResponse, 'base64'))
                .toString('utf8')
            )

            const cachedResponseString = JSON.stringify(cachedResponse)
            const status = cachedResponse[CACHE_RESPONSE_STATUS_KEY] ?? 200
            if (status === 402 || status === 429) {
              debugKy(
                'CACHE SKIP HIT',
                pruneUndefined({
                  method: request.method,
                  url: request.url,
                  normalizedUrl:
                    normalizedUrl === request.url ? undefined : normalizedUrl,
                  cacheKey,
                  status
                })
              )
              return
            }

            kyCacheStats.hits.push(getDebugInfo(request))
            debugKy('CACHE HIT', {
              method: request.method,
              url: request.url,
              cacheKey,
              cachedResponse: trimMessage(cachedResponseString)
            })

            return new Response(cachedResponseString, {
              status,
              headers: {
                'Content-Type': 'application/json',
                [CACHE_HEADER]: '1'
              }
            })
          } catch (err) {
            console.error('ky beforeResponse cache error', err)
          }
        }
      ],

      afterResponse: [
        async (request, _options, response) => {
          try {
            if (response.headers.get(CACHE_HEADER)) {
              // TODO: should we return a sentinal value to `ky` to skip any remaining hooks?
              // debugKy(
              //   `afterResponse ${request.method} ${request.url} ⇒ ${response.status}`,
              //   { result: 'cached' }
              // )
              return
            }

            if (response.headers.get(MOCK_HEADER)) {
              // debugKy(
              //   `afterResponse ${request.method} ${request.url} ⇒ ${response.status}`,
              //   { result: 'mocked' }
              // )
              return
            }

            // TODO: socialdata has `'cache-control': 'no-cache, private'`
            // if (isCachingDisabledForResponse(request, response)) {
            //   debugKy(
            //     `afterResponse ${request.method} ${request.url} ⇒ ${response.status}`,
            //     {
            //       result: 'caching disabled',
            //       headers: Object.fromEntries(response.headers.entries())
            //     }
            //   )

            //   return
            // }

            const contentType = response.headers.get('content-type')
            const cacheKey = await getCacheKeyForRequest(request)

            if (!cacheKey) {
              // This request is not cacheable
              debugKy(
                `afterResponse ${request.method} ${request.url} ⇒ ${response.status}`,
                {
                  result: 'request not cacheable'
                }
              )
              return
            }

            if (cacheable4XXStatuses.has(response.status)) {
              debugKy(
                `afterResponse ${request.method} ${request.url} ⇒ ${response.status}`,
                {
                  result: 'SET CACHE 4XX',
                  cacheKey,
                  contentType
                }
              )

              // TODO: Don't block on cache write
              await keyv.set(
                cacheKey,
                zlib
                  .brotliCompressSync(
                    Buffer.from(
                      JSON.stringify({
                        [CACHE_RESPONSE_STATUS_KEY]: Number(response.status)
                      }),
                      'utf8'
                    )
                  )
                  .toString('base64')
              )

              return
            }

            if (response.status < 200 || response.status >= 300) {
              // Ignore non-2XX responses
              debugKy(
                `afterResponse ${request.method} ${request.url} ⇒ ${response.status}`,
                {
                  result: `not cacheable ${response.status}`,
                  cacheKey
                }
              )
              return
            }

            if (!contentType?.includes('application/json')) {
              // This response is not cacheable
              debugKy(
                `afterResponse ${request.method} ${request.url} ⇒ ${response.status} ${contentType} content-type not cacheable`,
                {
                  result: `${contentType} content-type not cacheable`,
                  cacheKey,
                  contentType
                }
              )
              return
            }

            const responseBody: any = await response.json()
            const responseBodyAsBuffer = Buffer.from(
              JSON.stringify(responseBody),
              'utf8'
            )

            if (
              responseBodyAsBuffer.byteLength >
              config.CACHE_VALUE_MAX_SIZE_BYTES
            ) {
              // ignore response bodies which are too large
              debugKy(
                `afterResponse ${request.method} ${request.url} ⇒ ${response.status}`,
                {
                  result: `response body too large ${responseBodyAsBuffer.byteLength} bytes`,
                  cacheKey,
                  contentType,
                  headers: Object.fromEntries(response.headers.entries())
                }
              )
              return
            }

            debugKy(
              `afterResponse ${request.method} ${request.url} ⇒ ${response.status}`,
              {
                result: `SET CACHE ${response.status}`,
                cacheKey,
                contentType,
                bytes: responseBodyAsBuffer.byteLength
              }
            )

            // TODO: Don't block on cache write
            await keyv.set(
              cacheKey,
              zlib.brotliCompressSync(responseBodyAsBuffer).toString('base64')
            )
          } catch (err) {
            console.error(
              `afterResponse unexpected error ${request.method} ${request.url} ⇒ ${response.status}`,
              {
                result: 'error',
                headers: Object.fromEntries(response.headers.entries())
              },
              err
            )
          }
        }
      ]
    }
  })
}

function defaultBeforeRequest(request: Request): Response {
  return new Response(
    JSON.stringify({
      url: request.url,
      normalizedUrl: normalizeUrl(request.url),
      method: request.method,
      headers: request.headers
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        [MOCK_HEADER]: '1'
      }
    }
  )
}

export function mockKy(
  ky: KyInstance = defaultKy,
  {
    beforeRequest = defaultBeforeRequest,
    afterResponse = null
  }: {
    beforeRequest?: BeforeRequestHook | null
    afterResponse?: AfterResponseHook | null
  } = {}
): KyInstance {
  return ky.extend({
    hooks: {
      beforeRequest: beforeRequest ? [beforeRequest] : [],
      afterResponse: afterResponse ? [afterResponse] : []
    }
  })
}

/*
 * NOTE: ky hooks are appended when doing `ky.extend`, so if you already have a
 * beforeRequest hook, it will be called before any passed to `ky.extend`.
 *
 * For example:
 *
 * ```ts
 * // runs caching first, then mocking
 * const ky0 = mockKy(memoizeKy(ky))
 *
 * // runs mocking first, then caching
 * const ky1 = memoizeKy(mockKy(ky))
 *
 * // runs throttling first, then mocking
 * const ky2 = mockKy(throttleKy(ky, throttle))
 * ```
 */
export const memoizedKy = memoizeKy()

export class MemoizedOpenAIClient extends OpenAIClient {
  createChatCompletion = pMemoize(super.createChatCompletion, {
    cacheKey: (params) => getCacheKey('openai:chat', params),
    cache: keyv
  })
}

export function getCacheKey(
  label: string,
  params: Record<string, any>
): string {
  const hash = hashObject(params)
  return `${label}:${hash}`
}

function getDebugInfo(request: Request) {
  const method = request.method.toLowerCase()
  const url = normalizeUrl(request.url) ?? request.url
  return `${method} ${url}`
}

export function logCacheStats(ctx: types.AgenticContext) {
  console.warn(
    '\nCache stats:',
    pruneUndefined({
      hits: ctx.debug ? kyCacheStats.hits : kyCacheStats.hits.length,
      misses: kyCacheStats.misses,
      skip: kyCacheStats.skip
    })
  )
}

export function isCachingDisabledForResponse(
  request: Request,
  response: Response
): boolean {
  const domain = new URL(request.url).host

  if (config.cacheDomainWhitelist.has(domain)) {
    // Ignore `cache-control` response headers for whitelisted domains. Certain
    // providers like Diffbot and SocialDataTools set `no-store` or `no-cache`
    // in their responses, which we want to ignore in order to make maximum use
    // of our API credits.
    return false
  }

  return isCachingDisabledForHeaders(response.headers as Headers)
}

export function isCachingDisabledForHeaders(headers: Headers): boolean {
  const cacheControl = headers.get('cache-control')
  if (!cacheControl) return false

  const directives = cacheControl.split(',').map((s) => s.trim().toLowerCase())
  for (const directive of directives) {
    if (directive === 'no-cache' || directive === 'no-store') {
      return true
    }
  }

  return false
}
