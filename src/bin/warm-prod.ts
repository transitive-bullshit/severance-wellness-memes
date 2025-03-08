import 'dotenv/config'

import { gracefulExit } from 'exit-hook'
import defaultKy from 'ky'
import pMap from 'p-map'
import restoreCursor from 'restore-cursor'

import { featuredTwitterUsers } from '@/data/featured-twitter-users'
import * as config from '@/lib/config'
import { prisma } from '@/lib/db'

async function main() {
  const ky = defaultKy.extend({
    timeout: 60_000
  })

  const featuredUsers = new Set<string>(
    featuredTwitterUsers.map((t) => t.twitterUsername.toLowerCase())
  )

  const wellnessSessions = (
    await prisma.wellnessSession.findMany({
      include: {
        wellnessFacts: true
      }
    })
  ).filter((wellnessSession) =>
    featuredUsers.has(wellnessSession.twitterUsername.toLowerCase())
  )

  await pMap(
    wellnessSessions,
    async (wellnessSession, index) => {
      const { twitterUsername } = wellnessSession

      try {
        console.log(
          `${index + 1}/${wellnessSessions.length}) warming ${twitterUsername}`
        )
        await ky.get(`${config.prodUrl}/x/${twitterUsername}`)

        // await pMap(
        //   wellnessSession.wellnessFacts,
        //   async ({ id }) =>
        //     ky.get(`${config.prodUrl}/x/${twitterUsername}/o/${id}`),
        //   {
        //     concurrency: 4
        //   }
        // )

        await pMap(
          wellnessSession.wellnessFacts,
          async ({ id }) => ky.get(`${config.prodUrl}/o/${id}/image`),
          {
            concurrency: 4
          }
        )
      } catch (err: any) {
        console.error(
          `${index + 1}/${wellnessSessions.length}) ignoring error for ${twitterUsername}:`,
          err.message
        )
      }
    },
    {
      concurrency: 8
    }
  )
}

try {
  restoreCursor()
  await main()
  gracefulExit(0)
} catch (err) {
  console.error('error', err)
  gracefulExit(1)
}
