import Link from 'next/link'
import random from 'random'

import type * as types from '@/lib/types'
import { WellnessFactGallery } from '@/components/wellness-fact-gallery'
import { exampleTwitterUsers } from '@/data/example-twitter-users'
import { featuredWellnessFacts } from '@/data/featured-wellness-facts'

// import { prisma } from '@/lib/db'
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

        <div className='flex -space-x-2'>
          {exampleTwitterUsers.map((user) => (
            <img
              key={user.twitterUsername}
              alt={user.displayName}
              src={`https://unavatar.io/x/${user.twitterUsername}`}
              className='inline-block size-8 rounded-full ring-2 ring-white'
            />
          ))}
        </div>
      </section>

      <section className='flex-auto'>
        <h2>Examples</h2>

        <WellnessFactGallery wellnessFacts={featuredWellnessFacts} />
      </section>
    </>
  )
}

async function getFeaturedWellnessFacts(): Promise<types.WellnessFact[]> {
  return random.shuffle(featuredWellnessFacts)

  // TODO
  // const wellnessFacts = await prisma.wellnessFact.findMany({
  //   where: {
  //     tags: {
  //       has: 'featured'
  //     }
  //   },
  //   take: 10
  // })

  // return random.shuffle(wellnessFacts)
}
