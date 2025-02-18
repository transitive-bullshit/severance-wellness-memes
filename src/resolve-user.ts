import type { socialdata } from '@agentic/social-data'
import { omit } from '@agentic/core'
import pMap from 'p-map'

import type * as types from './types'
import { tryGetTweetById, tryGetTwitterUserById } from './twitter-utils'

export async function resolveTwitterUser(
  username: string,
  ctx: types.AgenticContext,
  {
    concurrency = 8,
    maxTimelineTweets = 100
  }: {
    concurrency?: number
    maxTimelineTweets?: number
  } = {}
): Promise<types.ResolvedTwitterUser> {
  const user = await ctx.socialData.getUserByUsername(username)

  const res: types.ResolvedTwitterUser = {
    id: user.id_str,
    user,

    timelineTweetIds: [],

    tweets: {},
    users: {}
  }

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

  userIds.add(user.id_str)

  function addTweet(tweet?: types.SocialDataTweet) {
    if (!tweet) return
    if (res.tweets[tweet.id_str]) return

    res.tweets[tweet.id_str] = {
      id_str: tweet.id_str,
      user_id_str: tweet.user.id_str,
      ...omit(
        tweet,
        'id',
        'id_str',
        'user',
        'text',
        'quoted_status',
        'retweeted_status'
      )
    }

    if (tweet.user?.id_str && !res.users[tweet.user.id_str]) {
      res.users[tweet.user.id_str] = tweet.user
    }

    tweetIds.add(tweet.id_str)
    userIds.add(tweet.user.id_str)

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

  return res
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
    const res = await ctx.socialData.getTweetsByUserId({
      userId,
      replies,
      cursor
    })

    if (!res.tweets?.length) break

    tweets.push(...res.tweets)
    cursor = res.next_cursor

    if (!cursor) break
  } while (tweets.length < limit)

  return tweets
}
