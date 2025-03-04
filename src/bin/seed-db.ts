import 'dotenv/config'

// import fs from 'node:fs/promises'
import { gracefulExit } from 'exit-hook'
import pMap from 'p-map'
import restoreCursor from 'restore-cursor'

import { seedTwitterUsers } from '@/data/seed-twitter-users'
// import { seedWellnessFacts } from '@/data/seed-wellness-facts'
// import type * as types from '@/lib/types'
// import { prisma } from '@/lib/db'
import { upsertWellnessSession } from '@/lib/upsert-wellness-session'

async function main() {
  /*
  const twitterUsername = 'transitive_bs'

  console.log(
    `Seeding featured wellness session for user https://x.com/${twitterUsername}...`
  )
  const resolvedTwitterUser = JSON.parse(
    await fs.readFile(`out/${twitterUsername}.json`, 'utf8')
  ) as types.ResolvedTwitterUser

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
      userFullName: resolvedTwitterUser.user.name,
      twitterUser: {
        create: resolvedTwitterUser
      },
      wellnessFacts: {
        create: seedWellnessFacts.map((text) => ({
          text,
          model: 'gpt-4.5-preview',
          twitterUsername: resolvedTwitterUser.user.screen_name,
          tags: ['featured']
        }))
      }
    },
    include: {
      wellnessFacts: true,
      pinnedWellnessFact: true,
      twitterUser: {
        select: {
          user: true
        }
      }
    }
  })

  const [_, wellnessSession] = await prisma.$transaction([
    deleteWellnessSessions,
    createWellnessSession
  ])

  console.log()
  console.log(JSON.stringify(wellnessSession, null, 2))
  console.log()

  */

  console.log(
    `Seeding wellness sessions for ${seedTwitterUsers.length} users...`
  )

  const wellnessSessions = await pMap(
    seedTwitterUsers,
    async (twitterUsername, i) => {
      try {
        console.log(
          `${i + 1}/${seedTwitterUsers.length}) Seeding wellness session for user https://x.com/${twitterUsername} ...`
        )

        const wellnessSession = await upsertWellnessSession({
          twitterUsername
        })

        console.log(
          `${i + 1}/${seedTwitterUsers.length}) ✅ Generated wellness session for user https://x.com/${twitterUsername}`,
          wellnessSession
        )

        return wellnessSession
      } catch (err: any) {
        console.error(
          `${i + 1}/${seedTwitterUsers.length}) Error seeding wellness session for user https://x.com/${twitterUsername}:`,
          err.message
        )
      }
    },
    {
      concurrency: 16
    }
  )

  const numWellnessSessions = wellnessSessions.filter(Boolean).length
  const numWellnessSessionErrors = wellnessSessions.filter((w) => !w).length

  console.log()
  console.log(`✅ Seeded ${numWellnessSessions} wellness sessions`)
  console.log(`❌ Encountered ${numWellnessSessionErrors} errors`)
  console.log()
}

try {
  restoreCursor()
  await main()
  gracefulExit(0)
} catch (err) {
  console.error('error', err)
  gracefulExit(1)
}
