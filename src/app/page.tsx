import Link from 'next/link'
import random from 'random'

import type * as types from '~/lib'
import { WellnessFactGallery } from '~/components'
import { prisma } from '~/lib/db'

import styles from './styles.module.css'

export default async function Page() {
  const wellnessFacts = await getFeaturedWellnessFacts()

  // TODO
  const twitterUsername = 'transitive_bs'

  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <h1>Severance Wellness Session</h1>
        <h3>Generate custom wellness facts based on your Twitter profile.</h3>

        <Link href={`/x/${twitterUsername}`}>View {twitterUsername}</Link>
      </section>

      <section className={styles.examples}>
        <h2>Examples</h2>

        <WellnessFactGallery wellnessFacts={wellnessFacts} />
      </section>
    </div>
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
