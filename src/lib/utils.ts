import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isPromiseLike<T = unknown>(val: unknown): val is Promise<T> {
  return (
    !!val &&
    (val instanceof Promise || typeof (val as Promise<T>).then === 'function')
  )
}
