import 'dotenv/config'

import { gracefulExit } from 'exit-hook'
import restoreCursor from 'restore-cursor'

// import { prisma } from '@/lib/db'

async function main() {
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
