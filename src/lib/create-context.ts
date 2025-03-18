import { SocialDataClient } from '@agentic/social-data'
import defaultKy from 'ky'

import type * as types from './types'

export function createContext(
  overrides: Partial<types.AgenticContext> = {}
): types.AgenticContext {
  const ky = overrides.ky ?? defaultKy

  return {
    debug: false,
    dryRun: false,
    noCache: false,
    raw: false,

    ky,

    // Required services
    socialData: new SocialDataClient({ ky }),

    // Allow for overrides
    ...overrides
  }
}
