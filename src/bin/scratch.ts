import 'dotenv/config'

import fs from 'node:fs/promises'

import type { TwitterUser } from '@prisma/client'
import { gracefulExit } from 'exit-hook'
import restoreCursor from 'restore-cursor'

import { prisma } from '@/lib/db'

async function main() {
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

  const twitterUsers: TwitterUser[] = []
  do {
    const t = await prisma.twitterUser.findMany({
      take: 10,
      skip: twitterUsers.length
    })

    console.log('fetched', t.length, 'twitter users')
    if (!t.length) break
    twitterUsers.push(...t)
  } while (true)

  console.log(`writing ${twitterUsers.length} twitter users`)
  await fs.writeFile('out/twitter-users.json', JSON.stringify(twitterUsers))

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
  // const twitterUsers = await prisma.twitterUser.findMany({
  //   where: {
  //     twitterUsername: {
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
