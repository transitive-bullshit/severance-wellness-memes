import 'dotenv/config'

import fs from 'node:fs/promises'

import { gracefulExit } from 'exit-hook'
import restoreCursor from 'restore-cursor'

import { createContext } from '@/lib/create-context'
import { resolveWellnessSession } from '@/lib/resolve-wellness-session'

async function main() {
  const ctx = createContext()

  const twitterUsername = 'kozerafilip'
  const wellnessSession = await resolveWellnessSession({ twitterUsername, ctx })
  await fs.writeFile(
    `out/${twitterUsername}.wellness-session.json`,
    JSON.stringify(wellnessSession, null, 2)
  )

  console.log(JSON.stringify(wellnessSession, null, 2))
}

try {
  restoreCursor()
  await main()
  gracefulExit(0)
} catch (err) {
  console.error('error', err)
  gracefulExit(1)
}
