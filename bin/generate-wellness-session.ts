import 'dotenv/config'

import fs from 'node:fs/promises'

import { gracefulExit } from 'exit-hook'
import restoreCursor from 'restore-cursor'

import { createContext } from '../src/create-context'
import { logCacheStats } from '../src/ky-utils'
import { resolveTwitterUser } from '../src/resolve-user'

async function main() {
  const ctx = createContext()

  const user = await resolveTwitterUser('transitive_bs', ctx)

  console.log(JSON.stringify(user, null, 2))
  await fs.writeFile(
    'out/transitive_bs.json',
    JSON.stringify(user, null, 2),
    'utf8'
  )
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
