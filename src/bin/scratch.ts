import 'dotenv/config'

import { gracefulExit } from 'exit-hook'
import pMap from 'p-map'
import restoreCursor from 'restore-cursor'

import { exampleTwitterUsers } from '@/data/example-twitter-users'
import { prisma } from '@/lib/db'

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

  const twitterUsers = await prisma.twitterUser.findMany({
    where: {
      twitterUsername: {
        in: exampleTwitterUsers.map((u) => u.twitterUsername)
      }
    },
    select: {
      id: true,
      user: true
    }
  })

  console.log(JSON.stringify(twitterUsers, null, 2))
}

try {
  restoreCursor()
  await main()
  gracefulExit(0)
} catch (err) {
  console.error('error', err)
  gracefulExit(1)
}
