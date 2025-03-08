'use server'

import pMap from 'p-map'

import { getWellnessFactById } from '@/lib/db/queries'

import { WellnessFactGallery } from './wellness-fact-gallery'

export async function WellnessFactGalleryByIds({
  wellnessFactIds,
  className
}: {
  wellnessFactIds: string[]
  className?: string
}) {
  const wellnessFacts = pMap(
    wellnessFactIds,
    async (wellnessFactId) => getWellnessFactById(wellnessFactId),
    {
      concurrency: 8
    }
  )
  // .then(async (f) => {
  //   await new Promise((resolve) => setTimeout(resolve, 10_000))
  //   return f
  // })

  return (
    <WellnessFactGallery
      wellnessFacts={wellnessFacts}
      className={className}
      estimatedNumItems={wellnessFactIds.length}
    />
  )
}
