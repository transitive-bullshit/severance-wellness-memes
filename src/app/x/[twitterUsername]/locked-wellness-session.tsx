import type * as types from '@/lib/types'
import { UnlockWellnessSessionCTA } from '@/components/unlock-wellness-session-cta'
import { UserAvatar } from '@/components/user-avatar'

import { CheckoutHandler } from './checkout-handler'

export function LockedWellnessSession({
  wellnessSession
}: {
  wellnessSession: types.WellnessSession
}) {
  const user = wellnessSession.twitterUser?.user

  return (
    <>
      <section>
        <h1>
          Hello, {user?.name}
          <UserAvatar user={user} className='ml-4' />
        </h1>

        <UnlockWellnessSessionCTA wellnessSession={wellnessSession} />

        <CheckoutHandler status='initial' />
      </section>
    </>
  )
}
