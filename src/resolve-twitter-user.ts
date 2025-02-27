import type { socialdata } from '@agentic/social-data'
import { omit, pick } from '@agentic/core'
import pMap from 'p-map'

import type * as types from './types'
import { tryGetTweetById, tryGetTwitterUserById } from './twitter-utils'

export async function resolveTwitterUser(
  username: string,
  ctx: types.AgenticContext,
  {
    concurrency = 8,
    maxTimelineTweets = 100,
    resolveUrls = false
  }: {
    concurrency?: number
    maxTimelineTweets?: number
    resolveUrls?: boolean
  } = {}
): Promise<types.ResolvedTwitterUser> {
  const user = await ctx.socialData.getUserByUsername(username)

  const res: types.ResolvedTwitterUser = {
    id: user.id_str,
    user,

    timelineTweetIds: [],

    tweets: {},
    users: {},
    urls: {}
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

  if (resolveUrls) {
    const urls = new Set<string>()

    for (const tweet of Object.values(res.tweets)) {
      for (const urlEntity of tweet.entities?.urls ?? []) {
        const url: string = urlEntity.expanded_url ?? urlEntity.url
        if (!url) continue
        urls.add(url)
      }
    }

    // for (const user of Object.values(res.users)) {
    //   if (user.url) {
    //     urls.add(user.url)
    //   }
    // }

    if (urls.size) {
      console.log(`\nresolving ${urls.size} urls`)

      const scrapedUrls = await ctx.scraper.scrapeUrls(Array.from(urls))

      res.urls = Object.fromEntries(
        Object.entries(scrapedUrls).map(([url, scrapedUrl]) => [
          url,
          scrapedUrl
            ? {
                url,
                ...pick(
                  scrapedUrl,
                  'title',
                  'description',
                  'author',
                  'byline',
                  'imageUrl',
                  'logoUrl',
                  'lang',
                  'publishedTime',
                  'siteName',
                  'textContent'
                )
              }
            : undefined
        ])
      )
    }
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
