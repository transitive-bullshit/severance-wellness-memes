import 'dotenv/config'

import fs from 'node:fs/promises'

import { gracefulExit } from 'exit-hook'
import restoreCursor from 'restore-cursor'

import { createContext } from '@/lib/create-context'
import { resolveTwitterUser } from '@/lib/resolve-twitter-user'

async function main() {
  const ctx = createContext()

  const twitterUsername = 'transitive_bs'
  const resolvedTwitterUser = await resolveTwitterUser({ twitterUsername, ctx })
  await fs.writeFile(
    `out/${twitterUsername}.json`,
    JSON.stringify(resolvedTwitterUser, null, 2)
  )

  console.log(JSON.stringify(resolvedTwitterUser, null, 2))
}

try {
  restoreCursor()
  await main()
  gracefulExit(0)
} catch (err) {
  console.error('error', err)
  gracefulExit(1)
}
