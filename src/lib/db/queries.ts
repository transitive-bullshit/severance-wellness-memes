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
    const wellnessFacts = await prisma.wellnessFact.findMany({
      where: {
        tags: {
          has: 'featured'
        }
      },
      take: 100
    })

    return random.shuffle(wellnessFacts)
  },
  ['featured-wellness-facts'],
  {
    revalidate: 60 * 60 * 24 // 24 hours in seconds
  }
)
