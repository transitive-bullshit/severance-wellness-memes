import 'dotenv/config'

import fs from 'node:fs/promises'

import { gracefulExit } from 'exit-hook'
import restoreCursor from 'restore-cursor'

import {
  createContext,
  generateWellnessFacts,
  logCacheStats,
  type ResolvedTwitterUser
} from '~/lib'

async function main() {
  const ctx = createContext()

  const resolvedTwitterUser = JSON.parse(
    await fs.readFile('out/transitive_bs.json', 'utf8')
  ) as ResolvedTwitterUser

  const result = await generateWellnessFacts({
    resolvedTwitterUser,
    ctx
  })

  console.log(JSON.stringify(result, null, 2))
  logCacheStats(ctx)
}

try {
  restoreCursor()
  await main()
  gracefulExit(0)
} catch (err) {
  console.error('error', err)
  gracefulExit(1)
}
