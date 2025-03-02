import { WellnessFactGallery } from '~/components'
import { prisma } from '~/lib/db'

import { getOrGenerateWellnessSession } from './get-or-generate-wellness-session'
import styles from './styles.module.css'

export default async function Page({
  params
}: {
  params: Promise<{ twitterUsername: string }>
}) {
  const { twitterUsername } = await params
  const { userFullName, wellnessFacts, twitterUser } =
    await getOrGenerateWellnessSession({ twitterUsername })

  const user = twitterUser!.user
  const userFullNameParts = userFullName
    ?.split(' ')
    .map((s: string) => s.trim())
    .filter(Boolean)
  const userDisplayName =
    userFullName && userFullNameParts!.length === 2
      ? `${userFullNameParts![0]} ${userFullNameParts![1]![0]}.`
      : userFullName || user.name || user.screen_name || 'Mysterious Guest'

  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>Hello {userDisplayName}</h1>
      </section>

      <section className={styles.wellnessFacts}>
        <WellnessFactGallery wellnessFacts={wellnessFacts} />
      </section>
    </div>
  )
}

export async function generateStaticParams() {
  return prisma.wellnessSession.findMany({
    select: {
      twitterUsername: true
    }
  })
}
