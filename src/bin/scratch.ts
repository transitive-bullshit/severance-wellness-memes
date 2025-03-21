import 'dotenv/config'

// import fs from 'node:fs/promises'
// import type { TwitterUser } from '@prisma/client'
// import { assert } from '@agentic/core'
import { gracefulExit } from 'exit-hook'
// import pMap from 'p-map'
import restoreCursor from 'restore-cursor'

// import { createContext } from '@/lib/create-context'
// import type * as types from '@/lib/types'
import { prisma } from '@/lib/db'

async function main() {
  // const ctx = createContext()
  // const res = await ctx.socialData.getUserByUsername('transitive_BSldkkdlkl')
  const res = await prisma.wellnessSession.findUniqueOrThrow({
    where: { twitterUsername: 'transitive_BS' }
  })
  console.log(res)

  // const res = await prisma.twitterUser.updateMany({
  //   where: {
  //     status: 'initial'
  //   },
  //   data: {
  //     status: 'resolved'
  //   }
  // })
  // console.log(res)

  // const twitterUsernameToWellnessSession = new Map<
  //   string,
  //   Partial<types.WellnessSession>
  // >()

  // for (const wellnessSession of wellnessSessions) {
  //   twitterUsernameToWellnessSession.set(
  //     wellnessSession.twitterUsername,
  //     wellnessSession
  //   )
  // }

  // Update all wellness facts to have the correct `twitterUserId`
  // const wellnessFacts = await prisma.wellnessFact.findMany()
  // await pMap(
  //   wellnessFacts,
  //   async (wellnessFact) => {
  //     const twitterUserId = twitterUsernameToWellnessSession.get(
  //       wellnessFact.twitterUsername
  //     )?.twitterUserId!
  //     assert(twitterUserId)
  //     console.log(wellnessFact.twitterUsername, '=>', twitterUserId)

  //     await prisma.wellnessFact.update({
  //       where: {
  //         id: wellnessFact.id
  //       },
  //       data: {
  //         twitterUserId
  //       }
  //     })
  //   },
  //   { concurrency: 16 }
  // )

  return

  // const wellnessSessions = await prisma.wellnessSession.findMany()
  // console.log(`writing ${wellnessSessions.length} wellness sessions`)
  // await fs.writeFile(
  //   'out/wellness-sessions.json',
  //   JSON.stringify(wellnessSessions, null, 2)
  // )

  // const wellnessFacts = await prisma.wellnessFact.findMany()
  // console.log(`writing ${wellnessFacts.length} wellness facts`)
  // await fs.writeFile(
  //   'out/wellness-facts.json',
  //   JSON.stringify(wellnessFacts, null, 2)
  // )

  // {
  //   const twitterUsers: TwitterUser[] = []
  //   do {
  //     const t = await prisma.twitterUser.findMany({
  //       take: 10,
  //       skip: twitterUsers.length
  //     })

  //     console.log('fetched', t.length, 'twitter users')
  //     if (!t.length) break
  //     twitterUsers.push(...t)
  //   } while (true)

  //   console.log(`writing ${twitterUsers.length} twitter users`)
  //   await fs.writeFile('out/twitter-users.json', JSON.stringify(twitterUsers))
  // }

  // const twitterUsers = await prisma.twitterUser.findMany({
  //   where: {
  //     twitterUsername: null
  //   },
  //   select: {
  //     id: true,
  //     user: true
  //   }
  // })
  // console.log('processing', twitterUsers.length, 'users')
  // await pMap(
  //   twitterUsers,
  //   async (twitterUser) => {
  //     console.log(twitterUser.user.screen_name)
  //     await prisma.twitterUser.update({
  //       where: {
  //         id: twitterUser.id
  //       },
  //       data: {
  //         twitterUsername: twitterUser.user.screen_name
  //       }
  //     })
  //   },
  //   { concurrency: 8 }
  // )
  // // const twitterUsers = await prisma.twitterUser.findMany({
  //   where: {
  //     twitterUsername: {
  // TODO: this will fail after moving to `citext`
  //       in: exampleTwitterUsers.map((u) => u.twitterUsername)
  //     }
  //   },
  //   select: {
  //     id: true,
  //     user: true
  //   }
  // })
  // const users = twitterUsers.map((u) => ({
  //   id: u.id,
  //   twitterUsername: u.user.screen_name,
  //   displayName: u.user.name,
  //   profileImageUrl: u.user.profile_image_url_https
  // }))
  // users.sort(
  //   (a, b) =>
  //     exampleTwitterUsers.findIndex(
  //       (u) => u.twitterUsername === a.twitterUsername
  //     ) -
  //     exampleTwitterUsers.findIndex(
  //       (u) => u.twitterUsername === b.twitterUsername
  //     )
  // )
  // console.log(JSON.stringify(users, null, 2))
  // console.log(users.length, exampleTwitterUsers.length)
}

try {
  restoreCursor()
  await main()
  gracefulExit(0)
} catch (err) {
  console.error('error', err)
  gracefulExit(1)
}
