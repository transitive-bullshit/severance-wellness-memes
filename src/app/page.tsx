import Link from 'next/link'
import random from 'random'

import type * as types from '@/lib/types'
import { HeroButton } from '@/components/hero-button'
import { WellnessFactGallery } from '@/components/wellness-fact-gallery'
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

        <HeroButton variant='purple' href={`/x/${twitterUsername}`}>
          View {twitterUsername}
        </HeroButton>

        {/* <div className='flex -space-x-2'>
          {featuredTwitterUsers.map((user) => (
            <Link
              href={`/x/${user.twitterUsername}`}
              key={user.twitterUsername}
            >
              <Image
                alt={user.displayName}
                src={user.profileImageUrl}
                className='inline-block size-8 rounded-full ring-2 ring-white transition-transform duration-300 scale-100 hover:scale-200'
                width={48}
                height={48}
              />
            </Link>
          ))}
        </div> */}
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
