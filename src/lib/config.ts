import 'dotenv/config'

import { getEnv } from '@agentic/core'

export const isServer = typeof window === 'undefined'
export const isSafari =
  !isServer && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const title = 'Severance Wellness Session'
export const description =
  'Roast your Twitter profile with AI-generated Severance wellness memes.'
export const domain =
  getEnv('VERCEL_PROJECT_PRODUCTION_URL') ?? 'severance.vercel.app'

export const author = 'Travis Fischer'
export const twitter = 'transitive_bs'
export const twitterUrl = `https://x.com/${twitter}`
export const copyright = `© ${new Date().getFullYear()} Lumon Industries. All rights reserved.`
export const madeWithLove = 'Made with ❤️ in Bangkok'
export const githubUrl =
  'https://github.com/transitive-bullshit/severance-wellness-memes'

export const env = getEnv('VERCEL_ENV') ?? getEnv('NODE_ENV') ?? 'development'
export const ci = getEnv('CI')
export const isCI = ci === 'true' || ci === '1'
export const isVercel = !!getEnv('VERCEL_ENV')
export const isDev = env === 'development' && !isVercel
export const isTest = env === 'test'

export const port = getEnv('PORT') || '3000'
export const prodUrl = `https://${domain}`
export const url = isDev ? `http://localhost:${port}` : prodUrl

export const apiBaseUrl =
  isDev || !getEnv('VERCEL_URL') ? url : `https://${getEnv('VERCEL_URL')}`

console.log({
  env,
  ci,
  isDev,
  isVercel,
  isTest,
  prodUrl,
  url,
  apiBaseUrl,
  vercelUrl: getEnv('VERCEL_URL')
})

// -----------------------------------------------------------------------------
// Caching
// -----------------------------------------------------------------------------

export const refreshCache = getEnv('REFRESH_CACHE') === 'true'
export const redisUrl = getEnv('REDIS_URL')!
export const redisNamespace = getEnv('REDIS_NAMESPACE') ?? 'severance'

export const CACHE_VALUE_MAX_SIZE_BYTES = 1_000_000

export const cacheUrlWhitelist = [getEnv('SCRAPER_API_BASE_URL')].filter(
  Boolean
)

export const cacheDomainWhitelist = new Set(
  cacheUrlWhitelist.map((url) => new URL(url).host)
)
