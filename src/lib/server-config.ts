import 'dotenv/config'

import { getEnv } from '@agentic/core'

export * from './config'

export const isCI = !!getEnv('CI')

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
