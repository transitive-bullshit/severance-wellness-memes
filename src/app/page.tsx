import Link from 'next/link'
import random from 'random'

import type * as types from '@/lib/types'
import { WellnessFactGallery } from '@/components/wellness-fact-gallery'
import { prisma } from '@/lib/db'

import styles from './styles.module.css'

export default async function Page() {
  const featuredWellnessFacts = await getFeaturedWellnessFacts()
  // await new Promise((resolve) => setTimeout(resolve, 20_000))

  // TODO
  const twitterUsername = 'transitive_bs'

  return (
    <>
      <section className={styles.intro}>
        <h1>Severance Wellness Session</h1>
        <h3>Generate custom wellness facts based on your Twitter profile.</h3>

        <h5>Who are you?</h5>

        <Link href={`/x/${twitterUsername}`}>View {twitterUsername}</Link>
      </section>

      <section className='flex-auto'>
        <h2>Examples</h2>

        <WellnessFactGallery wellnessFacts={featuredWellnessFacts} />
      </section>
    </>
  )
}

async function getFeaturedWellnessFacts(): Promise<types.WellnessFact[]> {
  const wellnessFacts = await prisma.wellnessFact.findMany({
    where: {
      tags: {
        has: 'featured'
      }
    },
    take: 10
  })

  return random.shuffle(wellnessFacts)
}
