import 'dotenv/config'

import { assert } from '@agentic/core'
import { gracefulExit } from 'exit-hook'
import restoreCursor from 'restore-cursor'

import { createContext } from '@/lib/create-context'
import { prisma } from '@/lib/db'
import { generateWellnessFacts } from '@/lib/generate-wellness-facts'

async function main() {
  const ctx = createContext()

  const twitterUsername = 'sama'

  const twitterUser = await prisma.twitterUser.findUnique({
    where: {
      twitterUsername
    }
  })
  assert(twitterUser, `Twitter user ${twitterUsername} not found`)

  const result = await generateWellnessFacts({
    twitterUser,
    ctx
  })
  console.log(JSON.stringify(result.wellnessFacts, null, 2))

  const wellnessFacts = await prisma.wellnessFact.createMany({
    data: result.wellnessFacts.map((text) => ({
      text,
      model: result.model,
      twitterUserId: twitterUser.user!.id_str,
      twitterUsername: twitterUser.user!.screen_name
    }))
  })

  console.log(JSON.stringify(wellnessFacts, null, 2))
}

try {
  restoreCursor()
  await main()
  gracefulExit(0)
} catch (err) {
  console.error('error', err)
  gracefulExit(1)
}
