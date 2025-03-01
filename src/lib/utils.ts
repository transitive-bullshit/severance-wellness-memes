import { assert } from '@agentic/core'
import hashObjectImpl, { type Options as HashObjectOptions } from 'hash-object'

export {
  assert,
  getEnv,
  omit,
  pick,
  pruneNullOrUndefined,
  pruneNullOrUndefinedDeep,
  pruneUndefined
} from '@agentic/core'

export function hashObject(
  object: Record<string, any>,
  options?: HashObjectOptions
): string {
  return hashObjectImpl(object, { algorithm: 'sha256', ...options })
}

export function trimMessage(
  message: string | undefined,
  { maxLength = 80 }: { maxLength?: number } = {}
): string {
  if (!message) return ''
  assert(typeof message === 'string', 'message must be a string')

  message = message.trim().split('\n')[0]!.trim()
  if (message.length < maxLength) return message
  message = `${message.slice(0, maxLength - 3)}...`

  return message
}
