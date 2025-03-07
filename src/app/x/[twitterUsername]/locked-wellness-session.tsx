import cs from 'clsx'

import type * as types from '@/lib/types'
import { UnlockWellnessSessionCTA } from '@/components/unlock-wellness-session-cta'
import { UserAvatar } from '@/components/user-avatar'

import { CheckoutHandler } from './checkout-handler'
import styles from './styles.module.css'

export function LockedWellnessSession({
  wellnessSession
}: {
  wellnessSession: types.WellnessSession
}) {
  const user = wellnessSession.twitterUser?.user

  return (
    <>
      <section className={cs(styles.intro)}>
        <h1 className={cs(styles.title, 'leading-none')}>
          Hello, {user?.name}
          <UserAvatar user={user} className='ml-4' />
        </h1>

        <UnlockWellnessSessionCTA wellnessSession={wellnessSession} />

        <CheckoutHandler status='initial' />
      </section>
    </>
  )
}
