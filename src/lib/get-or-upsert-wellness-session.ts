'use server'

import { unstable_cache as cache } from 'next/cache'

import type * as types from './types'
import { createContext } from './create-context'
import { prisma } from './db'
import { tryGetTwitterUserByUsername } from './twitter-utils'

export const getOrUpsertWellnessSession = cache(
  async ({
    twitterUsername
  }: {
    twitterUsername: string
  }): Promise<types.WellnessSession> => {
    const ctx = createContext()
    const existingWellnessSession = await prisma.wellnessSession.findUnique({
      where: {
        twitterUsername
      },
      include: {
        wellnessFacts: true,
        pinnedWellnessFact: true,
        twitterUser: {
          select: { user: true, status: true }
        }
      }
    })

    if (existingWellnessSession) {
      return existingWellnessSession
    }

    const user = await tryGetTwitterUserByUsername(twitterUsername, ctx, {
      fetchFromTwitter: true
    })
    console.log('twitter user', user)
    const status = user ? 'initial' : 'missing'

    const wellnessSession = await prisma.wellnessSession.create({
      data: {
        twitterUserId: user?.id_str,
        twitterUsername,
        status,
        twitterUser: {
          create: {
            twitterUsername,
            user,
            status,
            tweets: {},
            users: {}
          }
        }
      },
      include: {
        wellnessFacts: true,
        pinnedWellnessFact: true,
        twitterUser: {
          select: { user: true, status: true }
        }
      }
    })

    return wellnessSession
  }
)
