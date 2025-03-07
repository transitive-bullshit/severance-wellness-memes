import 'server-only'

import { unstable_cache as cache } from 'next/cache'
import random from 'random'

import type * as types from '@/lib/types'
import { prisma } from '@/lib/db'

export const getWellnessFactById = cache(
  async (id: string): Promise<types.WellnessFact | null> => {
    return prisma.wellnessFact.findUnique({
      where: { id }
    })
  }
)

export const getFeaturedWellnessFacts = cache(
  async (): Promise<types.WellnessFact[]> => {
    // await new Promise((resolve) => setTimeout(resolve, 10_000))

    const wellnessFacts = await prisma.wellnessFact.findMany({
      where: {
        tags: {
          has: 'featured'
        }
      },
      take: 20
    })

    return random.shuffle(wellnessFacts).slice(0, 4)
  },
  ['featured-wellness-facts'],
  {
    revalidate: 60 * 60 * 24 // 24 hours in seconds
  }
)
