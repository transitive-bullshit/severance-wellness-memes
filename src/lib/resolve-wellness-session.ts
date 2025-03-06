'use server'

import { assert } from '@agentic/core'

import type * as types from './types'
import { createContext } from './create-context'
import { prisma } from './db'
import { extractUserFullName } from './extract-user-full-name'
import { generateWellnessFacts } from './generate-wellness-facts'
import { getOrUpsertWellnessSession } from './get-or-upsert-wellness-session'
import { resolveTwitterUser } from './resolve-twitter-user'

export async function resolveWellnessSession({
  twitterUsername,
  ctx = createContext(),
  force = false,
  ...opts
}: {
  twitterUsername: string
  ctx?: types.AgenticContext
  positive?: boolean
  model?: string
  force?: boolean
}): Promise<types.WellnessSession & { existing: boolean }> {
  try {
    const existingWellnessSession = await getOrUpsertWellnessSession({
      twitterUsername
    })
    assert(
      existingWellnessSession,
      `Wellness session not found for ${twitterUsername}`
    )
    assert(
      existingWellnessSession.status !== 'missing',
      `Wellness session not found for ${twitterUsername}`
    )

    if (!force && existingWellnessSession.status === 'resolved') {
      return { ...existingWellnessSession, existing: true }
    }

    console.log('resolving wellness session...', { twitterUsername })

    const twitterUser = await resolveTwitterUser({
      twitterUsername,
      ctx,
      force
    })
    assert(twitterUser?.user, `Twitter user not found for ${twitterUsername}`)

    const [userFullName, generatedWellnessFacts] = await Promise.all([
      extractUserFullName({ twitterUser, ctx }),
      generateWellnessFacts({ twitterUser, ctx, ...opts })
    ])

    const createWellnessFacts = prisma.wellnessFact.createManyAndReturn({
      data: generatedWellnessFacts.wellnessFacts.map((text) => ({
        text,
        model: generatedWellnessFacts.model,
        twitterUserId: twitterUser.user!.id_str,
        twitterUsername
      }))
    })

    const updateWellnessSession = prisma.wellnessSession.update({
      where: {
        twitterUsername
      },
      data: {
        status: 'resolved',
        userFullName
      },
      include: {
        wellnessFacts: false,
        pinnedWellnessFact: true,
        twitterUser: {
          select: { user: true, status: true }
        }
      }
    })

    const [wellnessFacts, wellnessSession] = await prisma.$transaction([
      createWellnessFacts,
      updateWellnessSession
    ])

    return {
      ...wellnessSession,
      wellnessFacts,
      existing: false
    }
  } catch (err) {
    console.error(
      `Error resolving wellness session for user ${twitterUsername}`,
      err
    )
    throw new Error(
      `Error resolving wellness session for user ${twitterUsername}`,
      { cause: err }
    )
  }
}
