import { assert } from '@agentic/core'
import { type ClassValue, clsx } from 'clsx'
import hashObjectImpl, { type Options as HashObjectOptions } from 'hash-object'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export {
  assert,
  getEnv,
  omit,
  pick,
  pruneNullOrUndefined,
  pruneNullOrUndefinedDeep,
  pruneUndefined
} from '@agentic/core'

/**
 * Creates a hash of an object using SHA-256 algorithm by default.
 *
 * @param object - The object to hash
 * @param options - Optional hash config options
 * @returns The hashed string in HEX format
 */
export function hashObject(
  object: Record<string, any>,
  options?: HashObjectOptions
): string {
  return hashObjectImpl(object, { algorithm: 'sha256', ...options })
}

/**
 * Trims a message to a specified maximum length and removes newlines.
 *
 * @param message - The message to trim
 * @param options - Optional config options
 * @param options.maxLength - Maximum length of the returned string (default: 80)
 * @returns The trimmed message string
 */
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
