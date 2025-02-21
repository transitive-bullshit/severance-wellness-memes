import { SocialDataClient } from '@agentic/social-data'
import { ChatModel, createOpenAIClient } from '@dexaai/dexter'
import defaultKy from 'ky'

import type * as types from './types'
import { memoizedKy, MemoizedOpenAIClient } from './ky-utils'
import { ScraperClient } from './scraper-client'

export function createContext(
  overrides: Partial<types.AgenticContext> = {}
): types.AgenticContext {
  const ky = overrides.ky ?? (overrides.noCache ? defaultKy : memoizedKy)
  const openai =
    (overrides.openai ?? overrides.noCache)
      ? createOpenAIClient()
      : new MemoizedOpenAIClient()

  return {
    debug: false,
    dryRun: false,
    noCache: false,
    raw: false,

    ky,
    openai,

    model: new ChatModel({
      client: openai,
      params: {
        model: 'gpt-4o-mini'
      },
      debug: !!overrides.debug
    }),

    // Required services
    socialData: new SocialDataClient({ ky }),
    scraper: new ScraperClient({ ky }),

    // Allow for overrides
    ...overrides
  }
}
