import pMap from 'p-map'

import { getWellnessFactById } from '@/lib/db/queries'

import { WellnessFactGallery } from './wellness-fact-gallery'

// TODO: add suspense boundary and loading state
export async function WellnessFactGalleryByIds({
  wellnessFactIds,
  className
}: {
  wellnessFactIds: string[]
  className?: string
}) {
  const wellnessFacts = (
    await pMap(
      wellnessFactIds,
      async (wellnessFactId) => getWellnessFactById(wellnessFactId),
      {
        concurrency: 8
      }
    )
  ).filter(Boolean)

  return (
    <WellnessFactGallery wellnessFacts={wellnessFacts} className={className} />
  )
}
