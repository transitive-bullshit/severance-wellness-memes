import 'dotenv/config'

import { getEnv } from '@agentic/core'

export const env = getEnv('NODE_ENV') || 'development'
export const isTest = env === 'test'
export const ci = getEnv('CI')
export const isCI = ci === 'true' || ci === '1'
export const refreshCache = getEnv('REFRESH_CACHE') === 'true'
export const redisUrl = getEnv('REDIS_URL')!
export const redisNamespace = getEnv('REDIS_NAMESPACE') ?? 'severance'

export const CACHE_VALUE_MAX_SIZE_BYTES = 1_000_000

export const cacheUrlWhitelist = [
  // TODO
].filter(Boolean)

export const cacheDomainWhitelist = new Set(
  cacheUrlWhitelist.map((url) => new URL(url).host)
)
