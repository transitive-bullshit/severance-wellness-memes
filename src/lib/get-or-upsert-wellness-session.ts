'use server'

import { pick } from '@agentic/core'
import { nanoid } from 'nanoid'

import type * as types from './types'
import { createContext } from './create-context'
import { prisma } from './db'
import { revalidateWellnessSession } from './revalidate-wellness-session'
import { tryGetTwitterUserByUsername } from './twitter-utils'

export async function checkPendingWellnessSession({
  twitterUsername
}: {
  twitterUsername: string
}): Promise<string | undefined> {
  const wellnessSession = await prisma.wellnessSession.findUnique({
    where: {
      twitterUsername
    }
  })

  console.log(
    'check pending wellness session',
    pick(wellnessSession!, 'twitterUsername', 'status')
  )

  if (wellnessSession?.status === 'resolved') {
    await revalidateWellnessSession({ twitterUsername })
  }

  return wellnessSession?.status
}

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
    return existingWellnessSession.toJSON()
  }

  const ctx = createContext()
  const user = await tryGetTwitterUserByUsername(twitterUsername, ctx, {
    fetchFromTwitter: true
  })
  console.log('twitter user', user)
  const status = user ? 'initial' : 'missing'

  try {
    const twitterUserId = user?.id_str ?? `missing-${nanoid()}`

    const wellnessSession = await prisma.wellnessSession.upsert({
      where: {
        twitterUsername
      },
      update: {
        status
      },
      create: {
        twitterUserId,
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

    return wellnessSession.toJSON()
  } catch (err) {
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
      return existingWellnessSession.toJSON()
    }

    throw err
  }
}
