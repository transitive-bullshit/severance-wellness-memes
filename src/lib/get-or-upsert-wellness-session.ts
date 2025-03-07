'use server'

import { nanoid } from 'nanoid'

import type * as types from './types'
import { createContext } from './create-context'
import { prisma } from './db'
import { clone } from './server-utils'
import { tryGetTwitterUserByUsername } from './twitter-utils'

export async function getOrUpsertWellnessSession({
  twitterUsername
}: {
  twitterUsername: string
}): Promise<types.WellnessSession> {
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
    return clone(existingWellnessSession)
  }

  const ctx = createContext()
  const user = await tryGetTwitterUserByUsername(twitterUsername, ctx, {
    fetchFromTwitter: true
  })
  console.log('twitter user', user)
  const status = user ? 'initial' : 'missing'

  const wellnessSession = await prisma.wellnessSession.create({
    data: {
      twitterUserId: user?.id_str ?? `missing-${nanoid()}`,
      twitterUsername,
      status,
      twitterUser: {
        create: {
          twitterUsername,
          user,
          status
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

  return clone(wellnessSession)
}
