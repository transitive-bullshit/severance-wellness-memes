import { WellnessFactGallery } from '@/components/wellness-fact-gallery'
import { prisma } from '@/lib/db'
import { upsertWellnessSession } from '@/lib/upsert-wellness-session'

import styles from './styles.module.css'

export default async function Page({
  params
}: {
  params: Promise<{ twitterUsername: string }>
}) {
  const { twitterUsername } = await params
  const { wellnessSession } = await upsertWellnessSession({
    twitterUsername
  })
  const { userFullName, twitterUser, wellnessFacts, pinnedWellnessFact } =
    wellnessSession

  const user = twitterUser!.user
  const userFullNameParts = userFullName
    ?.split(' ')
    .map((s: string) => s.trim())
    .filter(Boolean)
  const userDisplayName =
    userFullName && userFullNameParts!.length === 2
      ? `${userFullNameParts![0]} ${userFullNameParts![1]![0]}.`
      : userFullName || user.name || user.screen_name || 'Mysterious Guest'

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
      <section className={styles.intro}>
        <h1 className={styles.title}>Hello {userDisplayName}</h1>
      </section>

      <section className='flex-auto'>
        <WellnessFactGallery wellnessFacts={wellnessFacts} />
      </section>
    </>
  )
}

export async function generateStaticParams() {
  return prisma.wellnessSession.findMany({
    select: {
      twitterUsername: true
    }
  })
}
