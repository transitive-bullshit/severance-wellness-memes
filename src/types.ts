import type { socialdata, SocialDataClient } from '@agentic/social-data'
import type { ChatModel } from '@dexaai/dexter'
import type { KyInstance } from 'ky'
import type { OpenAIClient } from 'openai-fetch'
import type { Simplify } from 'type-fest'

export type SocialDataTwitterUser = socialdata.User
export type SocialDataTweet = socialdata.Tweet

export type Tweet = Simplify<
  Omit<
    SocialDataTweet,
    'id' | 'user' | 'text' | 'quoted_status' | 'retweeted_status'
  > & {
    user_id_str: string
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

  // urls: Record<string, LinkMetadata>
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

  // OpenAI
  openai: OpenAIClient
  model: ChatModel
}>
