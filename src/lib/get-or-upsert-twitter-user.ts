'use server'

import type * as types from './types'
import { createContext } from './create-context'
import { prisma } from './db'
import { tryGetTwitterUserByUsername } from './twitter-utils'

export async function getOrUpsertTwitterUser({
  twitterUsername,
  ctx = createContext()
}: {
  twitterUsername: string
  ctx?: types.AgenticContext
}): Promise<types.TwitterUser> {
  const twitterUser = await prisma.twitterUser.findUnique({
    where: {
      twitterUsername
    }
  })

  if (twitterUser) {
    return twitterUser
  }

  const user = await tryGetTwitterUserByUsername(twitterUsername, ctx, {
    fetchFromTwitter: true
  })

  console.log('twitter user', user)
  if (!user) {
    return prisma.twitterUser.create({
      data: {
        twitterUsername,
        status: 'missing'
      }
    })
  }

  user.profile_image_url_https = user.profile_image_url_https.replace(
    '_normal.jpg',
    '_400x400.jpg'
  )

  return prisma.twitterUser.upsert({
    where: {
      twitterUsername
    },
    update: {
      user
    },
    create: {
      id: user.id_str,
      twitterUsername,
      status: 'initial',
      user
    }
  })
}
