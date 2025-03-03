'use server'

import { generateWellnessSession } from '@/lib'
import { createContext } from '@/lib/create-context'
import { prisma, type WellnessSession } from '@/lib/db'
import { resolveTwitterUser } from '@/lib/resolve-twitter-user'

export async function getOrGenerateWellnessSession({
  twitterUsername
}: {
  twitterUsername: string
}): Promise<WellnessSession> {
  await new Promise((resolve) => setTimeout(resolve, 5000))

  // First check if we already have a session
  const existingSession = await prisma.wellnessSession.findUnique({
    where: { twitterUsername },
    include: {
      wellnessFacts: true,
      twitterUser: {
        select: { user: true }
      }
    }
  })

  if (existingSession) {
    return existingSession
  }

  // If not, create a new context and generate a session
  // We need to be careful with what we're passing to the server action
  try {
    const ctx = createContext()
    const resolvedTwitterUser = await resolveTwitterUser({
      twitterUsername,
      ctx
    })

    return generateWellnessSession({
      resolvedTwitterUser,
      ctx
    })
  } catch (err) {
    console.error('Error generating wellness session:', err)
    throw new Error(
      `Failed to generate wellness session for ${twitterUsername}`
    )
  }
}
