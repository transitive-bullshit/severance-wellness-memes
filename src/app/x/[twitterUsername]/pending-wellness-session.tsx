'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

import type * as types from '@/lib/types'
import { LoadingIndicator } from '@/components/loading-indicator'
import { UserAvatar } from '@/components/user-avatar'
import { checkPendingWellnessSession } from '@/lib/get-or-upsert-wellness-session'
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
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        console.log('>>> client check pending')
        const status = await checkPendingWellnessSession({ twitterUsername })
        console.log('<<< client check pending', { status })

        if (status === 'resolved') {
          console.log('DONE: resolved wellness session', { twitterUsername })
          await revalidateWellnessSession({ twitterUsername })
          toast.success('Your memes are ready! Please refresh the page.')
          // router.replace(`/x/${twitterUsername}`)
          window.location.href = `/x/${twitterUsername}`
        }
      } catch (err: any) {
        console.warn('error fetching wellness session', err.message)
      }
    }, 2000)
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

        <p className='max-w-2xl text-center'>
          Your memes are being generated. This will take a few minutes. This
          page should automatically refresh once they&apos;re ready, but if it
          doesn&apos;t, try refreshing after a few minutes.
        </p>

        <p className='max-w-xl mt-4 text-center'>Praise Kier.</p>
      </section>

      <section className='flex-auto justify-center p-8'>
        <LoadingIndicator />
      </section>

      <CheckoutHandler status='pending' />
    </>
  )
}
