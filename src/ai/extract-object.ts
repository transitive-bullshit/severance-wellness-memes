import type { SetRequired, Simplify } from 'type-fest'

import type * as types from './types'
import { type AIChainParams, createAIChain } from './create-ai-chain'

export type ExtractObjectParams<Result extends types.AIChainResult = string> =
  Simplify<
    SetRequired<
      Omit<AIChainParams<Result>, 'tools' | 'toolCallConcurrency' | 'params'>,
      'schema'
    > & {
      params: SetRequired<Partial<types.ChatParams>, 'messages'>
    }
  >

export function extractObject<Result extends types.AIChainResult = string>(
  args: ExtractObjectParams<Result>
): Promise<Result> {
  const chain = createAIChain(args)
  return chain() as Promise<Result>
}
