import { SocialDataClient } from '@agentic/social-data'
import defaultKy from 'ky'
import { OpenAIClient } from 'openai-fetch'

import type * as types from './types'
import { memoizedKy, MemoizedOpenAIClient } from './ky-utils'

export function createContext(
  overrides: Partial<types.AgenticContext> = {}
): types.AgenticContext {
  const ky = overrides.ky ?? (overrides.noCache ? defaultKy : memoizedKy)
  const openai =
    (overrides.openai ?? overrides.noCache)
      ? new OpenAIClient()
      : new MemoizedOpenAIClient()

  return {
    debug: false,
    dryRun: false,
    noCache: false,
    raw: false,

    ky,
    openai,

    // model: new ChatModel({
    //   client: openai,
    //   params: {
    //     model: 'gpt-4o-mini'
    //   },
    //   debug: !!overrides.debug
    // }),

    // Required services
    socialData: new SocialDataClient({ ky }),

    // Allow for overrides
    ...overrides
  }
}
