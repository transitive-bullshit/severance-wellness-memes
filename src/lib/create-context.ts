import { SocialDataClient } from '@agentic/social-data'
import defaultKy from 'ky'
import { OpenAIClient } from 'openai-fetch'

import type * as types from './types'

export function createContext(
  overrides: Partial<types.AgenticContext> = {}
): types.AgenticContext {
  const ky = overrides.ky ?? defaultKy
  const openai = overrides.openai ?? new OpenAIClient()

  return {
    debug: false,
    dryRun: false,
    noCache: false,
    raw: false,

    ky,
    openai,

    // Required services
    socialData: new SocialDataClient({ ky }),

    // Allow for overrides
    ...overrides
  }
}
