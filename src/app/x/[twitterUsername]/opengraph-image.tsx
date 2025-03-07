import { unstable_cache as cache } from 'next/cache'
import random from 'random'

import { prisma } from '@/lib/db'
import { generateWellnessFactImageResponse } from '@/lib/generate-wellness-fact-image-response'

// Image metadata
export const size = {
  width: 2400,
  height: 1200
}
export const contentType = 'image/png'
export const dynamic = 'force-static'

export default async function Image({
  params
}: {
  params: Promise<{ twitterUsername: string }>
}) {
  const { twitterUsername } = await params

  const getHeroWellnessFactId = cache(
    async ({
      twitterUsername
    }: {
      twitterUsername: string
    }): Promise<string> => {
      let heroWellnessFactId = 'cm7sb9ea400022r4kmxnvohbk'

      try {
        const wellnessSession = await prisma.wellnessSession.findUnique({
          where: { twitterUsername },
          select: { pinnedWellnessFactId: true, wellnessFacts: true }
        })

        heroWellnessFactId =
          wellnessSession?.pinnedWellnessFactId ??
          wellnessSession?.wellnessFacts[0]?.id ??
          random.choice(
            await prisma.wellnessFact.findMany({
              where: { tags: { has: 'featured' } },
              select: { id: true }
            })
          )?.id ??
          heroWellnessFactId
      } catch (err) {
        console.error('open-graph image error', err)
      }

      return heroWellnessFactId
    },
    [],
    {
      revalidate: 60 * 60 * 24 // 1 day in seconds
    }
  )

  const wellnessFactId = await getHeroWellnessFactId({ twitterUsername })

  return generateWellnessFactImageResponse({ wellnessFactId })
}
