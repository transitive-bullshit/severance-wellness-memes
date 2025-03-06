'use server'

import type { socialdata } from '@agentic/social-data'
import { assert, omit } from '@agentic/core'
import pMap from 'p-map'

import type * as types from './types'
import { numTwitterTweetsProcessed } from './config'
import { prisma } from './db'
import { getOrUpsertTwitterUser } from './get-or-upsert-twitter-user'
import { tryGetTweetById, tryGetTwitterUserById } from './twitter-utils'

export async function resolveTwitterUser({
  twitterUsername,
  ctx,
  concurrency = 8,
  maxTimelineTweets = numTwitterTweetsProcessed,
  force = false
}: {
  twitterUsername: string
  ctx: types.AgenticContext
  concurrency?: number
  maxTimelineTweets?: number
  force?: boolean
}): Promise<types.TwitterUser & { existing: boolean }> {
  const existingTwitterUser = await getOrUpsertTwitterUser({
    twitterUsername,
    ctx
  })

  if (!force && existingTwitterUser.status === 'resolved') {
    return { ...existingTwitterUser, existing: true }
  }

  const res = existingTwitterUser as Pick<
    types.TwitterUser,
    'timelineTweetIds' | 'tweets' | 'users' | 'status'
  > & {
    user: NonNullable<types.TwitterUser['user']>
  }
  const { user } = res
  assert(
    user && res.status !== 'missing',
    `Twitter user not found for ${twitterUsername}`
  )

  console.log('resolving twitter user...', { twitterUsername })

  // TODO: fetch most recent tweets based on possible existing `timelineTweetIds`
  const timelineTweets = await getTimelineTweetsByUserId(
    {
      userId: user.id_str,
      replies: false,
      limit: maxTimelineTweets
    },
    ctx
  )

  res.timelineTweetIds = timelineTweets.map((tweet) => tweet.id_str)

  const tweetIds = new Set<string>()
  const userIds = new Set<string>()

  res.users[user.id_str] = user
  userIds.add(user.id_str)

  function addTweet(tweet?: types.SocialDataTweet) {
    if (!tweet) return

    if (tweet.user?.id_str && !res.users[tweet.user.id_str]) {
      res.users[tweet.user.id_str] = tweet.user
    }
    userIds.add(tweet.user.id_str)

    if (res.tweets[tweet.id_str]) return

    res.tweets[tweet.id_str] = {
      id_str: tweet.id_str,
      user_id_str: tweet.user.id_str,
      user_screen_name: tweet.user.screen_name,
      ...omit(
        tweet,
        'id',
        'id_str',
        'user',
        'text',
        'quoted_status',
        'retweeted_status',
        'in_reply_to_status_id',
        'in_reply_to_user_id',
        'quoted_status_id'
      ),
      is_retweet: !!tweet.retweeted_status
    }

    tweetIds.add(tweet.id_str)

    if (tweet.retweeted_status) {
      addTweet(tweet.retweeted_status)
      tweet.retweeted_status = null
    }

    if (tweet.quoted_status) {
      addTweet(tweet.quoted_status)
      tweet.quoted_status = null
    }

    if (tweet.in_reply_to_status_id_str) {
      tweetIds.add(tweet.in_reply_to_status_id_str)
    }

    if (tweet.in_reply_to_user_id_str) {
      userIds.add(tweet.in_reply_to_user_id_str)
    }

    for (const userMention of tweet.entities.user_mentions ?? []) {
      userIds.add(userMention.id_str)
    }
  }

  for (const tweet of timelineTweets) {
    addTweet(tweet)
  }

  const missingUserIds = Array.from(
    userIds.difference(new Set(Object.keys(res.users)))
  )

  const missingTweetIds = Array.from(
    tweetIds.difference(new Set(Object.keys(res.tweets)))
  )

  if (missingUserIds.length) {
    console.log(`\nresolving ${missingUserIds.length} missing users`)

    await pMap(
      missingUserIds,
      async (userId) => {
        try {
          const user = await tryGetTwitterUserById(userId, ctx, {
            fetchFromTwitter: true
          })
          if (user) res.users[userId] = user
        } catch {}
      },
      { concurrency }
    )
  }

  if (missingTweetIds.length) {
    console.log(`\nresolving ${missingTweetIds.length} missing tweets`)

    await pMap(
      missingTweetIds,
      async (tweetId) => {
        try {
          const tweet = await tryGetTweetById(tweetId, ctx, {
            fetchFromTwitter: true
          })
          addTweet(tweet)
        } catch {}
      },
      { concurrency }
    )
  }

  console.log('PRE resolved twitter user', {
    ...res,
    timelineTweetIds: res.timelineTweetIds.length,
    users: Object.keys(res.users).length,
    tweets: Object.keys(res.tweets).length
  })

  const twitterUser = await prisma.twitterUser.update({
    where: {
      twitterUsername
    },
    data: {
      ...res,
      status: 'resolved'
    }
  })

  console.log('POST resolved twitter user', {
    ...twitterUser,
    timelineTweetIds: twitterUser.timelineTweetIds.length,
    users: Object.keys(twitterUser.users).length,
    tweets: Object.keys(twitterUser.tweets).length
  })

  return {
    ...twitterUser,
    existing: false
  }
}

export async function getTimelineTweetsByUserId(
  {
    userId,
    replies = false,
    limit = 100
  }: {
    userId: string
    replies?: boolean
    limit?: number
  },
  ctx: types.AgenticContext
): Promise<socialdata.Tweet[]> {
  const tweets: socialdata.Tweet[] = []
  let cursor: string | undefined

  do {
    try {
      const res = await ctx.socialData.getTweetsByUserId({
        userId,
        replies,
        cursor
      })

      if (!res.tweets?.length) break

      tweets.push(...res.tweets)
      cursor = res.next_cursor
    } catch (err) {
      console.warn(
        `ignoring error fetching tweets for twitter user ${userId}`,
        err
      )
      break
    }

    if (!cursor) break
  } while (tweets.length < limit)

  return tweets
}
