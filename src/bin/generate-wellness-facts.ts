import 'dotenv/config'

import fs from 'node:fs/promises'

import { gracefulExit } from 'exit-hook'
import restoreCursor from 'restore-cursor'

import type * as types from '@/lib/types'
import { createContext } from '@/lib/create-context'
import { generateWellnessFacts } from '@/lib/generate-wellness-facts'

async function main() {
  const ctx = createContext()

  const twitterUsername = 'rauchg'
  const resolvedTwitterUser = JSON.parse(
    await fs.readFile(`out/${twitterUsername}.json`, 'utf8')
  ) as types.ResolvedTwitterUser

  const result = await generateWellnessFacts({
    resolvedTwitterUser,
    ctx
  })

  console.log(JSON.stringify(result, null, 2))
}

try {
  restoreCursor()
  await main()
  gracefulExit(0)
} catch (err) {
  console.error('error', err)
  gracefulExit(1)
}
