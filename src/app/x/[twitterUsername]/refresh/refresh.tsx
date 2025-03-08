'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

import { revalidateWellnessSession } from '@/lib/revalidate-wellness-session'

export function RefreshPage({ twitterUsername }: { twitterUsername: string }) {
  useEffect(() => {
    ;(async () => {
      await revalidateWellnessSession({ twitterUsername })
      redirect(`/x/${twitterUsername}`)
    })()
  }, [twitterUsername])

  return null
}
