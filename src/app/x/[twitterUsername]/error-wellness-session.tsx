import type * as types from '@/lib/types'
import { UserAvatar } from '@/components/user-avatar'

import { CheckoutHandler } from './checkout-handler'

export function ErrorWellnessSession({
  wellnessSession
}: {
  wellnessSession: types.WellnessSession
}) {
  const user = wellnessSession.twitterUser?.user

  return (
    <>
      <section>
        <h1>
          {user?.name ?? user?.screen_name}
          <UserAvatar
            user={wellnessSession.twitterUser?.user}
            className='ml-4'
          />
        </h1>

        <p className='max-w-xl'>
          There was an error processing this profile. Please contact support and
          include this URL.
        </p>
      </section>

      <CheckoutHandler status='error' />
    </>
  )
}
