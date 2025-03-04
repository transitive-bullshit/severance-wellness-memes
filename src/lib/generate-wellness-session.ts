'use server'

import type * as types from './types'
import { prisma } from './db'
import { extractUserFullName } from './extract-user-full-name'
import { generateWellnessFacts } from './generate-wellness-facts'

export async function generateWellnessSession({
  resolvedTwitterUser,
  ctx,
  ...opts
}: {
  resolvedTwitterUser: types.ResolvedTwitterUser
  ctx: types.AgenticContext
  positive?: boolean
  model?: string
}): Promise<types.WellnessSession> {
  const [userFullName, generatedWellnessFacts] = await Promise.all([
    extractUserFullName({ resolvedTwitterUser, ctx }),
    generateWellnessFacts({ resolvedTwitterUser, ctx, ...opts })
  ])

  const deleteWellnessSessions = prisma.wellnessSession.deleteMany({
    where: {
      OR: [
        { twitterUserId: resolvedTwitterUser.user.id_str },
        { twitterUsername: resolvedTwitterUser.user.screen_name }
      ]
    }
  })

  const createWellnessSession = prisma.wellnessSession.create({
    data: {
      twitterUserId: resolvedTwitterUser.user.id_str,
      twitterUsername: resolvedTwitterUser.user.screen_name,
      userFullName,
      twitterUser: {
        create: resolvedTwitterUser
      },
      wellnessFacts: {
        create: generatedWellnessFacts.wellnessFacts.map((text) => ({
          text,
          model: generatedWellnessFacts.model,
          twitterUsername: resolvedTwitterUser.user.screen_name
        }))
      }
    },
    include: {
      wellnessFacts: true,
      pinnedWellnessFact: true,
      twitterUser: {
        select: { user: true }
      }
    }
  })

  const [_, wellnessSession] = await prisma.$transaction([
    deleteWellnessSessions,
    createWellnessSession
  ])

  return wellnessSession
}
