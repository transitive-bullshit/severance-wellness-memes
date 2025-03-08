import { unstable_cache as cache } from 'next/cache'
import { notFound } from 'next/navigation'

import { generateWellnessFactImageResponse } from '@/lib/generate-wellness-fact-image-response'
import { getOrUpsertWellnessSession } from '@/lib/get-or-upsert-wellness-session'

// Image metadata
export const size = {
  width: 2400,
  height: 1200
}
export const contentType = 'image/png'
export const dynamic = 'force-static'

export default async function Image({
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

  return generateWellnessFactImageResponse({
    content: (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '0.5em'
        }}
      >
        <p
          style={{
            margin: '0',
            padding: '0',
            textAlign: 'center'
          }}
        >
          Hello, {userDisplayName}
        </p>

        <p
          style={{
            margin: '0',
            padding: '0',
            textAlign: 'center'
          }}
        >
          These wellness facts are based on your outie&apos;s Twitter profile.
        </p>

        <p
          style={{
            margin: '0',
            padding: '0',
            textAlign: 'center'
          }}
        >
          Try to enjoy each one equally.
        </p>
      </div>
    )
  })
}
