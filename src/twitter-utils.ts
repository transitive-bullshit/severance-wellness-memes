import QuickLRU from 'quick-lru'

import type * as types from './types'
import { uriToUrl } from './url-utils'

const tweetsCache = new QuickLRU<string, types.SocialDataTweet>({
  maxSize: 10_000
})
const usersCache = new QuickLRU<string, types.SocialDataTwitterUser>({
  maxSize: 4000
})

const twitterDomains = new Set([
  'twitter.com',
  'www.twitter.com',
  'x.com',
  'www.x.com'
])

/**
 * Ensures the URL has a protocol. If missing, returns the URL prepended with 'https://'.
 */
function ensureProtocol(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url
  }
  return url
}

export function isTwitterUrl(url?: string): url is string {
  if (!url) return false

  try {
    // Add protocol if missing
    const processedUrl = ensureProtocol(url)
    const { host, pathname } = new URL(processedUrl)
    if (!twitterDomains.has(host)) return false

    // Check that the pathname has at least one non-empty segment
    const segments = pathname.split('/').filter((segment) => segment !== '')
    return segments.length > 0
  } catch {
    return false
  }
}

export function getTwitterUsername(url?: string): string {
  if (!url) return ''

  try {
    // Ensure protocol is present
    const processedUrl = ensureProtocol(url)
    // Validate that the URL is a valid Twitter URL
    if (!isTwitterUrl(processedUrl)) return ''

    // Extract the first non-empty segment from the pathname
    const segments = new URL(processedUrl).pathname.split('/').filter((segment) => segment !== '')
    return segments[0] || ''
  } catch {
    return ''
  }
}

export function normalizeTwitterProfileUri(uri?: string): string {
  if (!uri) return ''

  // Attempt to extract username directly
  let username = getTwitterUsername(uri)
  if (!username) {
    // If no username found, try converting the uri using uriToUrl
    const convertedUrl = uriToUrl(uri)
    username = getTwitterUsername(convertedUrl)
  }
  if (username) {
    return `https://twitter.com/${username}`
  }
  return uri
}

/**
 * Returns the larger of two Twitter IDs, which is used in several places to
 * keep track of the most recent tweet we've seen or processed.
 */
export function maxTwitterId(
  tweetIdA?: string,
  tweetIdB?: string
): string | undefined {
  if (!tweetIdA && !tweetIdB) {
    return
  }

  if (!tweetIdA) {
    return tweetIdB
  }

  if (!tweetIdB) {
    return tweetIdA
  }

  if (tweetIdA.length < tweetIdB.length) {
    return tweetIdB
  } else if (tweetIdA.length > tweetIdB.length) {
    return tweetIdA
  }

  if (tweetIdA < tweetIdB) {
    return tweetIdB
  }

  return tweetIdA
}

/**
 * Returns the smaller of two Twitter IDs, which is used in several places to
 * keep track of the least recent tweet we've seen or processed.
 */
export function minTwitterId(
  tweetIdA?: string,
  tweetIdB?: string
): string | undefined {
  if (!tweetIdA && !tweetIdB) {
    return
  }

  if (!tweetIdA) {
    return tweetIdB
  }

  if (!tweetIdB) {
    return tweetIdA
  }

  if (tweetIdA.length < tweetIdB.length) {
    return tweetIdA
  } else if (tweetIdA.length > tweetIdB.length) {
    return tweetIdB
  }

  if (tweetIdA < tweetIdB) {
    return tweetIdA
  }

  return tweetIdB
}

/**
 * JS comparator function for comparing two Tweet IDs.
 */
export function tweetIdComparator(a: string, b: string): number {
  if (a === b) {
    return 0
  }

  const max = maxTwitterId(a, b)
  if (max === a) {
    return 1
  } else {
    return -1
  }
}

/**
 * JS comparator function for comparing two tweet-like objects.
 */
export function tweetComparator(
  tweetA: { id: string },
  tweetB: { id: string }
): number {
  const a = tweetA.id
  const b = tweetB.id
  return tweetIdComparator(a, b)
}

/** Attempts to retrieve a tweet from the cache */
export async function tryGetTweetById(
  tweetId: string,
  ctx: Pick<types.AgenticContext, 'socialData'>,
  {
    fetchFromTwitter = false
  }: {
    // Whether or not to fetch tweets from twitter if they're missing from the cache
    fetchFromTwitter?: boolean
  } = {}
): Promise<types.SocialDataTweet | undefined> {
  if (!tweetId) return

  let tweet = tweetsCache.get(tweetId)
  if (tweet) return tweet

  if (fetchFromTwitter) {
    try {
      tweet = await ctx.socialData.getTweetById(tweetId)

      if (tweet) {
        tweetsCache.set(tweetId, tweet)
        return tweet
      }
    } catch (err: any) {
      // Silently ignore
      console.warn(
        `ignoring error fetching tweet ${tweetId}`,
        [err.status, err.type, err.toString()].filter(Boolean).join(' ')
      )
    }
  }

  return tweet
}

/** Attempts to retrieve a user from the cache */
export async function tryGetTwitterUserById(
  userId: string,
  ctx: Pick<types.AgenticContext, 'socialData'>,
  {
    fetchFromTwitter = false
  }: {
    // Whether or not to fetch from twitter if missing from the cache
    fetchFromTwitter?: boolean
  } = {}
): Promise<types.SocialDataTwitterUser | undefined> {
  if (!userId) return

  let user = usersCache.get(userId)
  if (user) return user

  if (fetchFromTwitter) {
    try {
      user = await ctx.socialData.getUserById(userId)

      if (user) {
        usersCache.set(userId, user)
        return user
      }
    } catch (err: any) {
      // Silently ignore
      console.warn(
        `ignoring error fetching twitter user ${userId}`,
        [err.status, err.type, err.toString()].filter(Boolean).join(' ')
      )
    }
  }

  return user
}