'use server'

import type * as types from './types'
import { createContext } from './create-context'
import { getWellnessSessionByTwitterUsername } from './db-queries'
import { generateWellnessSession } from './generate-wellness-session'
import { resolveTwitterUser } from './resolve-twitter-user'

export async function upsertWellnessSession({
  twitterUsername,
  force = false,
  failIfNotExists = false
}: {
  twitterUsername: string
  force?: boolean
  failIfNotExists?: boolean
}): Promise<
  { wellnessSession: types.WellnessSession; existing: boolean } | undefined
> {
  // await new Promise((resolve) => setTimeout(resolve, 5000))

  if (!force) {
    // First check if we already have a session
    const wellnessSession =
      await getWellnessSessionByTwitterUsername(twitterUsername)

    if (wellnessSession) {
      return { wellnessSession, existing: true }
    }
  }

  if (failIfNotExists) {
    return
  }

  // If not, create a new context and generate a session
  // We need to be careful with what we're passing to the server action
  try {
    const ctx = createContext()
    const resolvedTwitterUser = await resolveTwitterUser({
      twitterUsername,
      ctx
    })

    const wellnessSession = await generateWellnessSession({
      resolvedTwitterUser,
      ctx
    })

    return { wellnessSession, existing: false }
  } catch (err) {
    console.error(
      `Error generating wellness session for user ${twitterUsername}`,
      err
    )
    throw new Error(
      `Error generating wellness session for user ${twitterUsername}`,
      { cause: err }
    )
  }
}
