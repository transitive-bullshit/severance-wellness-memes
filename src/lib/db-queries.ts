import 'server-only'

import { unstable_cache as cache } from 'next/cache'
import { notFound } from 'next/navigation'
import random from 'random'

import type * as types from '@/lib/types'
import { prisma } from '@/lib/db'

export const getWellnessFactById = cache(
  async (id: string): Promise<types.WellnessFact> => {
    const wellnessFact = await prisma.wellnessFact.findUnique({
      where: { id }
    })
    if (!wellnessFact) return notFound()
    return wellnessFact
  }
)

export const getFeaturedWellnessFacts = cache(
  async (): Promise<types.WellnessFact[]> => {
    const wellnessFacts = await prisma.wellnessFact.findMany({
      where: {
        tags: {
          has: 'featured'
        }
      },
      take: 100
    })

    return random.shuffle(wellnessFacts)
  }
)

export const getWellnessSessionByTwitterUsername = cache(
  async (twitterUsername: string): Promise<types.WellnessSession | null> => {
    return prisma.wellnessSession.findUnique({
      where: { twitterUsername },
      include: {
        wellnessFacts: true,
        pinnedWellnessFact: true,
        twitterUser: {
          select: { user: true }
        }
      }
    })
  }
)
