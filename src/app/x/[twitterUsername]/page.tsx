import { WellnessFactGallery } from '~/components'
import { generateWellnessSession } from '~/lib'
import { createContext } from '~/lib/create-context'
import { prisma, type WellnessSession } from '~/lib/db'
import { resolveTwitterUser } from '~/lib/resolve-twitter-user'

import styles from './styles.module.css'

async function getOrGenerateWellnessSession({
  twitterUsername
}: {
  twitterUsername: string
}): Promise<WellnessSession> {
  const wellnessSession = await prisma.wellnessSession.findUnique({
    where: { twitterUsername },
    include: {
      wellnessFacts: true,
      twitterUser: {
        select: { user: true }
      }
    }
  })

  if (wellnessSession) {
    return wellnessSession
  }

  const ctx = createContext()
  const resolvedTwitterUser = await resolveTwitterUser({
    twitterUsername,
    ctx
  })

  return generateWellnessSession({
    resolvedTwitterUser,
    ctx
  })
}

export default async function Page({
  params
}: {
  params: Promise<{ twitterUsername: string }>
}) {
  const { twitterUsername } = await params
  const { userFullName, wellnessFacts, twitterUser } =
    await getOrGenerateWellnessSession({
      twitterUsername
    })

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
