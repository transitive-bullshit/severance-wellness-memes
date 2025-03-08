'use server'

import { assert } from '@agentic/core'

import type * as types from './types'
import { createContext } from './create-context'
import { prisma } from './db'
import { extractUserFullName } from './extract-user-full-name'
import { generateWellnessFacts } from './generate-wellness-facts'
import { getOrUpsertWellnessSession } from './get-or-upsert-wellness-session'
import { resolveTwitterUser } from './resolve-twitter-user'
import { revalidateWellnessSession } from './revalidate-wellness-session'

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

    // eslint-disable-next-line no-lone-blocks
    // {
    //   await new Promise((resolve) => setTimeout(resolve, 5000))
    //   await prisma.wellnessSession.update({
    //     where: {
    //       twitterUsername
    //     },
    //     data: {
    //       status: 'resolved'
    //     }
    //   })

    //   console.log('MOCK: resolved wellness session', { twitterUsername })
    //   return { ...existingWellnessSession, existing: false }
    // }

    const twitterUser = await resolveTwitterUser({
      twitterUsername,
      ctx,
      force
    })
    assert(twitterUser?.user, `Twitter user not found for ${twitterUsername}`)

    console.log('>>> resolving user full name', { twitterUsername })
    console.log('>>> resolving wellness facts', { twitterUsername })

    const [userFullName, generatedWellnessFacts] = await Promise.all([
      extractUserFullName({ twitterUser, ctx }),
      generateWellnessFacts({ twitterUser, ctx, ...opts })
    ])

    console.log('<<< resolving user full name', {
      twitterUsername,
      userFullName
    })
    console.log('<<< resolving wellness facts', {
      twitterUsername,
      generatedWellnessFacts
    })

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

    console.log('>>> transaction')
    const [wellnessFacts, wellnessSession] = await prisma.$transaction([
      createWellnessFacts,
      updateWellnessSession
    ])
    console.log('<<< transaction')
    await revalidateWellnessSession({ twitterUsername })

    const resolvedWellnessSession: types.WellnessSession = {
      ...wellnessSession,
      wellnessFacts
    }
    console.log('resolved wellness session', { twitterUsername })

    return {
      ...resolvedWellnessSession,
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
