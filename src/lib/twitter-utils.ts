import QuickLRU from 'quick-lru'

import type * as types from './types'
import { uriToUrl } from './url-utils'

const tweetsCacheById = new QuickLRU<string, types.SocialDataTweet>({
  maxSize: 10_000
})
const usersCacheById = new QuickLRU<string, types.SocialDataTwitterUser>({
  maxSize: 4000
})
const usersCacheByUsername = new QuickLRU<string, types.SocialDataTwitterUser>({
  maxSize: 4000
})

const twitterDomains = new Set([
  'twitter.com',
  'www.twitter.com',
  'x.com',
  'www.x.com'
])

export function isTwitterUrl(url?: string): url is string {
  if (!url) return false

  try {
    const { host, pathname } = new URL(url)
    if (!twitterDomains.has(host)) return false

    const parts = pathname.split('/')
    if (parts.length < 2 || !parts[1]) return false

    return true
  } catch {
    return false
  }
}

export function normalizeTwitterProfileUri(uri?: string): string | undefined {
  const username = getTwitterUsername(uri) ?? getTwitterUsername(uriToUrl(uri))
  if (!username) return

  return `twitter.com/${username}`
}

export function getTwitterUsername(url?: string): string | undefined {
  if (!isTwitterUrl(url)) return

  const { pathname } = new URL(url)
  return pathname.split('/')[1]
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

  let tweet = tweetsCacheById.get(tweetId)
  if (tweet) return tweet

  if (fetchFromTwitter) {
    try {
      tweet = await ctx.socialData.getTweetById(tweetId)

      if (tweet) {
        tweetsCacheById.set(tweetId, tweet)
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

  let user = usersCacheById.get(userId)
  if (user) return user

  if (fetchFromTwitter) {
    try {
      user = await ctx.socialData.getUserById(userId)

      if (user) {
        usersCacheById.set(userId, user)
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

/** Attempts to retrieve a user from the cache */
export async function tryGetTwitterUserByUsername(
  username: string,
  ctx: Pick<types.AgenticContext, 'socialData'>,
  {
    fetchFromTwitter = false
  }: {
    // Whether or not to fetch from twitter if missing from the cache
    fetchFromTwitter?: boolean
  } = {}
): Promise<types.SocialDataTwitterUser | undefined> {
  if (!username) return

  let user = usersCacheByUsername.get(username)
  if (user) return user

  if (fetchFromTwitter) {
    try {
      user = await ctx.socialData.getUserByUsername(username)

      if (user) {
        usersCacheByUsername.set(username, user)
        return user
      }
    } catch (err: any) {
      // Silently ignore
      console.warn(
        `ignoring error fetching twitter user ${username}`,
        [err.status, err.type, err.toString()].filter(Boolean).join(' ')
      )
    }
  }

  return user
}
