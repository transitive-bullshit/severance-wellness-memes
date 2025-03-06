import cs from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { WellnessFactGallery } from '@/components/wellness-fact-gallery'
import { seedTwitterUsers } from '@/data/seed-twitter-users'
import { getOrUpsertWellnessSession } from '@/lib/get-or-upsert-wellness-session'

import { LockedWellnessSession } from './locked-wellness-session'
import { PendingWellnessSession } from './pending-wellness-session'
import styles from './styles.module.css'

export default async function Page({
  params
}: {
  params: Promise<{ twitterUsername: string }>
}) {
  const { twitterUsername } = await params
  const wellnessSession = await getOrUpsertWellnessSession({
    twitterUsername
  })
  if (!wellnessSession) return notFound()

  const {
    status,
    userFullName,
    twitterUser,
    wellnessFacts,
    pinnedWellnessFact
  } = wellnessSession

  if (status === 'missing' || twitterUser?.status === 'missing') {
    return notFound()
  }

  if (status === 'initial') {
    return <LockedWellnessSession wellnessSession={wellnessSession} />
  }

  if (status === 'pending') {
    return <PendingWellnessSession wellnessSession={wellnessSession} />
  }

  if (status === 'error') {
    return (
      <>
        <section className={cs(styles.intro)}>
          <h1 className={cs(styles.title, 'leading-none')}>
            There was an error processing this profile. TODO
          </h1>
        </section>
      </>
    )
  }

  const user = twitterUser!.user!
  const userFullNameParts = userFullName
    ?.split(' ')
    .map((s: string) => s.trim())
    .filter(Boolean)
  const userDisplayName =
    userFullName && userFullNameParts!.length === 2
      ? `${userFullNameParts![0]} ${userFullNameParts![1]![0]}.`
      : userFullName || user.name || user.screen_name || 'Mysterious Guest'
  const userFirstName =
    userFullName &&
    (userFullNameParts!.length === 2 || userFullNameParts!.length === 1)
      ? userFullNameParts![0]
      : userFullName || user.name || user.screen_name || 'Guest'

  // Make sure any pinned wellness fact is at the start of the gallery.
  if (pinnedWellnessFact) {
    const pinnedWellnessFactIndex = wellnessFacts.findIndex(
      (wellnessFact) =>
        pinnedWellnessFact?.id && pinnedWellnessFact.id === wellnessFact.id
    )
    if (pinnedWellnessFactIndex > 0) {
      wellnessFacts.splice(pinnedWellnessFactIndex, 1)
    }

    wellnessFacts.splice(0, 0, pinnedWellnessFact)
  }

  return (
    <>
      <section className={cs(styles.intro)}>
        <h1 className={cs(styles.title, 'leading-none')}>
          Hello, {userDisplayName}
          {user.profile_image_url_https && (
            <Link
              href={`https://x.com/${user.screen_name}`}
              target='_blank'
              rel='noopener noreferrer'
              className='ml-4'
            >
              <Image
                alt={user.name}
                src={user.profile_image_url_https}
                width={48}
                height={48}
                className='inline-block size-10 rounded-full ring-1 ring-accent-foreground'
              />
            </Link>
          )}
        </h1>

        <p
          className={cs(
            styles.desc,
            'text-muted-foreground pb-8 border-b border-border text-sm text-balance text-center'
          )}
        >
          All right, {userFirstName}. What I’d like to do is share with you some
          facts about your outie. Because your outie is an exemplary person,
          these facts should be very pleasing. Just relax your body and be open
          to the facts. Try to enjoy each one equally.
        </p>
      </section>

      <section className='flex-auto'>
        <WellnessFactGallery wellnessFacts={wellnessFacts} />
      </section>
    </>
  )
}

export async function generateStaticParams() {
  return seedTwitterUsers.map((twitterUsername) => ({ twitterUsername }))
}
