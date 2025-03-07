import { Suspense } from 'react'

import { AnimatedHeroSection } from '@/components/animated-hero-section'
import { WellnessFactGallery } from '@/components/wellness-fact-gallery'
import { getFeaturedWellnessFacts } from '@/lib/db/queries'

// import { prisma } from '@/lib/db'

// Separate component for the examples section
async function ExamplesSection() {
  const featuredWellnessFacts = (await getFeaturedWellnessFacts()).slice(0, 4)
  return <WellnessFactGallery wellnessFacts={featuredWellnessFacts} />
}

export default function Page() {
  return (
    <>
      <AnimatedHeroSection />

      <section className='flex-auto'>
        <Suspense
          fallback={<WellnessFactGallery wellnessFacts={[]} isLoading={true} />}
        >
          <ExamplesSection />
        </Suspense>
      </section>
    </>
  )
}
