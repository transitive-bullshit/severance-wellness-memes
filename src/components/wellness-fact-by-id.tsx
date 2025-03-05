import { getWellnessFactById } from '@/lib/db-queries'

import { WellnessFact } from './wellness-fact'

// TODO: add suspense boundary and loading state
export async function WellnessFactById({
  wellnessFactId,
  className
}: {
  wellnessFactId: string
  className?: string
}) {
  const wellnessFact = await getWellnessFactById(wellnessFactId)
  if (!wellnessFact) return null // TODO

  return <WellnessFact wellnessFact={wellnessFact} className={className} />
}
