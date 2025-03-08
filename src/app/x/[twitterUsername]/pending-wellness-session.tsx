'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import type * as types from '@/lib/types'
import { LoadingIndicator } from '@/components/loading-indicator'
import { UserAvatar } from '@/components/user-avatar'
import { revalidateWellnessSession } from '@/lib/revalidate-wellness-session'

import { CheckoutHandler } from './checkout-handler'

export function PendingWellnessSession({
  wellnessSession
}: {
  wellnessSession: types.WellnessSession
}) {
  const { twitterUsername } = wellnessSession
  const user = wellnessSession.twitterUser?.user
  const router = useRouter()

  // TODO: This is hacky...
  // TODO: This isn't even working on prod...
  useEffect(() => {
    const interval = setInterval(async () => {
      await revalidateWellnessSession({ twitterUsername })
      router.refresh()
    }, 1000)
    return () => clearInterval(interval)
  }, [router, twitterUsername])

  return (
    <>
      <section>
        <h1>
          Hello, {user?.name ?? user?.screen_name}
          <UserAvatar
            user={wellnessSession.twitterUser?.user}
            className='ml-4'
          />
        </h1>

        <p className='max-w-xl'>
          Your memes are being generated. This will take a few minutes. This
          page should automatically refresh once they&apos;re ready, but if it
          doesn&apos;t, try refreshing after a few minutes.
        </p>

        <p className='max-w-xl mt-4'>Praise Kier.</p>
      </section>

      <section className='flex-auto justify-center p-8'>
        <LoadingIndicator />
      </section>

      <CheckoutHandler status='pending' />
    </>
  )
}
