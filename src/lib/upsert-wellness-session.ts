'use server'

import { createContext } from './create-context'
import { prisma, type WellnessSession } from './db'
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
}): Promise<{ wellnessSession: WellnessSession; existing: boolean }> {
  // await new Promise((resolve) => setTimeout(resolve, 5000))

  if (!force) {
    // First check if we already have a session
    const wellnessSession = await prisma.wellnessSession.findUnique({
      where: { twitterUsername },
      include: {
        wellnessFacts: true,
        pinnedWellnessFact: true,
        twitterUser: {
          select: { user: true }
        }
      }
    })

    if (wellnessSession) {
      return { wellnessSession, existing: true }
    }
  }

  if (failIfNotExists) {
    throw new Error(`User ${twitterUsername} has not been generated yet.`)
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
