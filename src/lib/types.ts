import type { socialdata, SocialDataClient } from '@agentic/social-data'
import type { ChatModel } from '@dexaai/dexter'
import type { KyInstance } from 'ky'
import type { OpenAIClient } from 'openai-fetch'
import type { Simplify } from 'type-fest'

import type { ScraperClient } from './scraper-client'

export type SocialDataTwitterUser = socialdata.User
export type SocialDataTweet = socialdata.Tweet

export type Tweet = Simplify<
  Omit<
    SocialDataTweet,
    | 'id'
    | 'user'
    | 'text'
    | 'quoted_status'
    | 'retweeted_status'
    | 'in_reply_to_status_id'
    | 'in_reply_to_user_id'
    | 'quoted_status_id'
  > & {
    user_id_str: string
    user_screen_name: string
    is_retweet?: boolean
  }
>

export interface ResolvedTwitterUser {
  id: string
  user: SocialDataTwitterUser

  timelineTweetIds: string[]
  // favoriteTweetIds: string[]

  // followerUserIds: string[]
  // followingUserIds: string[]

  tweets: Record<string, Tweet>
  users: Record<string, SocialDataTwitterUser>

  urls: Record<string, LinkContent | undefined>
}

export interface LinkContent {
  url: string
  title: string
  description: string
  author: string
  byline: string
  imageUrl: string
  logoUrl: string
  lang: string
  publishedTime: string
  siteName: string
  textContent: string
}

export type AgenticContext = Readonly<{
  // General options
  debug: boolean
  dryRun: boolean
  noCache: boolean
  raw: boolean

  // HTTP fetch client
  ky: KyInstance

  // Required Services
  socialData: SocialDataClient
  scraper: ScraperClient

  // OpenAI
  openai: OpenAIClient
  model: ChatModel
}>
