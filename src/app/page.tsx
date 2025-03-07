import { AnimatedHeroSection } from '@/components/animated-hero-section'
import { WellnessFactGallery } from '@/components/wellness-fact-gallery'
import { getFeaturedWellnessFacts } from '@/lib/db/queries'

export default function Page() {
  const featuredWellnessFacts = getFeaturedWellnessFacts()

  return (
    <>
      <AnimatedHeroSection />

      <section className='flex-auto'>
        <WellnessFactGallery wellnessFacts={featuredWellnessFacts} />
      </section>
    </>
  )
}
