import type { Metadata, ResolvingMetadata } from 'next'
import { pruneNullOrUndefined } from '@agentic/core'
import { unstable_cache as cache } from 'next/cache'
import { notFound } from 'next/navigation'

import { GenerateWellnessSessionCTA } from '@/components/generate-wellness-session-cta'
import { UserAvatar } from '@/components/user-avatar'
import { WellnessFactGallery } from '@/components/wellness-fact-gallery'
import { seedTwitterUsers } from '@/data/seed-twitter-users'
import * as config from '@/lib/config'
import { getOrUpsertWellnessSession } from '@/lib/get-or-upsert-wellness-session'

import { ErrorWellnessSession } from './error-wellness-session'
import { LockedWellnessSession } from './locked-wellness-session'
import { PendingWellnessSession } from './pending-wellness-session'

export default async function Page({
  params
}: {
  params: Promise<{ twitterUsername: string }>
}) {
  const { twitterUsername } = await params

  const getWellnessSession = cache(getOrUpsertWellnessSession, [
    `wellness-session-${twitterUsername}`
  ])

  const wellnessSession = await getWellnessSession({ twitterUsername })
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
    return <ErrorWellnessSession wellnessSession={wellnessSession} />
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
      <section>
        <h1 className='mb-0! items-center flex flex-col md:flex-row justify-center'>
          Hello, {userDisplayName}
          <UserAvatar
            user={wellnessSession.twitterUser?.user}
            className='ml-4'
          />
        </h1>

        <p className='text-muted-foreground py-8 mb-8 border-b border-border text-sm text-balance text-center max-w-2xl'>
          All right, {userFirstName}. What I’d like to do is share with you some
          facts about your outie. Because your outie is an exemplary person,
          these facts should be very pleasing. Just relax your body and be open
          to the facts. Try to enjoy each one equally.
        </p>

        <WellnessFactGallery wellnessFacts={wellnessFacts} priority={true} />
      </section>

      <section>
        <GenerateWellnessSessionCTA />
      </section>
    </>
  )
}

export async function generateStaticParams() {
  return seedTwitterUsers.map((twitterUsername) => ({ twitterUsername }))
}

export async function generateMetadata(
  {
    params
  }: {
    params: Promise<{ twitterUsername: string }>
  },
  parentP: ResolvingMetadata
): Promise<Metadata> {
  const { twitterUsername } = await params

  const getWellnessSession = cache(getOrUpsertWellnessSession, [
    `wellness-session-${twitterUsername}`
  ])

  const wellnessSession = await getWellnessSession({ twitterUsername })
  if (!wellnessSession) return notFound()

  if (wellnessSession.status !== 'resolved') {
    return {}
  }

  const { userFullName, twitterUser } = wellnessSession

  const user = twitterUser!.user!
  const userFullNameParts = userFullName
    ?.split(' ')
    .map((s: string) => s.trim())
    .filter(Boolean)
  const userDisplayName =
    userFullName && userFullNameParts!.length === 2
      ? `${userFullNameParts![0]} ${userFullNameParts![1]![0]}.`
      : userFullName || user.name || user.screen_name || 'Mysterious Guest'

  const title = `Severance Wellness Session for ${userDisplayName}`
  const parent = await parentP

  return {
    title,
    openGraph: pruneNullOrUndefined({
      ...parent.openGraph,
      images: `${config.prodUrl}/x/${twitterUsername}/opengraph-image`,
      title
    }),
    twitter: pruneNullOrUndefined({
      ...parent.twitter,
      images: `${config.prodUrl}/x/${twitterUsername}/twitter-image`,
      title
    })
  }
}
