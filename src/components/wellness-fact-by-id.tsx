'use server'

import { getWellnessFactById } from '@/lib/db/queries'

import { WellnessFact } from './wellness-fact'

export async function WellnessFactById({
  wellnessFactId,
  className
}: {
  wellnessFactId: string
  className?: string
}) {
  const wellnessFact = getWellnessFactById(wellnessFactId)

  return <WellnessFact wellnessFact={wellnessFact} className={className} />
}
