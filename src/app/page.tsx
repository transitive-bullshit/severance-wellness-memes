import Link from 'next/link'

import { AnimatedInput } from '@/components/animated-input'
import { GenerateWellnessSessionCTA } from '@/components/generate-wellness-session-cta'
import { UserAvatar } from '@/components/user-avatar'
import { WellnessFactGalleryByIds } from '@/components/wellness-fact-gallery-by-ids'

export default function Page() {
  return (
    <>
      <section>
        <h1 className='my-0! text-center text-balance leading-snug md:leading-none'>
          Severance Wellness Session
        </h1>

        <h5 className='my-8! text-center text-balance'>
          Create your own Severance memes based on your Twitter profile.
        </h5>

        <div className='w-full max-w-lg'>
          <AnimatedInput focused={true} />
        </div>
      </section>

      <section className='flex-1'>
        <h2 className='text-center text-balance'>Example Memes</h2>

        <WellnessFactGalleryByIds
          wellnessFactIds={[
            'cm7sb9ea400022r4kmxnvohbk',
            'cm7sb9ea4000h2r4k69tva2fr'
          ]}
        />
      </section>

      <section className='flex-1'>
        <h2 className='text-center text-balance'>
          Examples Roasting{' '}
          <Link href='x/elonmusk' className='link'>
            Elon Musk
          </Link>
          <UserAvatar
            user={{
              screen_name: 'elonmusk',
              name: 'Elon Musk',
              profile_image_url_https:
                'https://pbs.twimg.com/profile_images/1893803697185910784/Na5lOWi5_400x400.jpg'
            }}
            type='profile'
            className='ml-3'
          />
        </h2>

        <WellnessFactGalleryByIds
          wellnessFactIds={[
            'cm7u6r0jw002a2r6o5kn6tdr4',
            // 'cm7u6r0jw002i2r6oy2l2qgdn'
            // 'cm7u6r0jw00262r6oglz3jqyc'
            // 'cm7u6r0jw002b2r6opuvsacd4'
            'cm7u6r0jw002f2r6oazj0a9bs'
          ]}
        />
      </section>

      <section className='flex-1'>
        <h2 className='text-center text-balance'>
          Examples Roasting <Link href='x/realDonaldTrump'>Donald Trump</Link>
          <UserAvatar
            user={{
              screen_name: 'realDonaldTrump',
              name: 'Donald Trump',
              profile_image_url_https:
                'https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg'
            }}
            type='profile'
            className='ml-3'
          />
        </h2>

        <WellnessFactGalleryByIds
          wellnessFactIds={[
            'cm7uapehe000k2rk228t5qs8f',
            'cm7uapehe000j2rk26wdfyc64'
          ]}
        />
      </section>

      <section className='flex-1'>
        <h2 className='text-center text-balance'>
          Examples Roasting <Link href='x/realDonaldTrump'>Taylor Swift</Link>
          <UserAvatar
            user={{
              screen_name: 'taylorswift13',
              name: 'Taylor Swift',
              profile_image_url_https:
                'https://pbs.twimg.com/profile_images/1766836345450672128/HpuBz514_normal.jpg'
            }}
            type='profile'
            className='ml-3'
          />
        </h2>

        <WellnessFactGalleryByIds
          wellnessFactIds={[
            'cm7u6tqoi005n2r6ot07aod58',
            'cm7u6tqoj005o2r6og63hxk6x',
            'cm7u6tqoi005d2r6od0s3ptcg',
            'cm7u6tqoi005i2r6oeuess3kd',
            ''
          ]}
        />
      </section>

      <section>
        <GenerateWellnessSessionCTA />
      </section>
    </>
  )
}
