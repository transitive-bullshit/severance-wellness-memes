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
  return (
    <>
      <section className={cs(styles.intro)}>
        <h1 className={cs(styles.title, 'leading-none')}>
          This profile has not been processed yet.
          <UserAvatar
            user={wellnessSession.twitterUser?.user}
            className='ml-4'
          />
        </h1>

        <p className='whitespace-pre my-16'>
          {JSON.stringify(wellnessSession, null, 2)}
        </p>

        <UnlockWellnessSessionCTA wellnessSession={wellnessSession} />

        <CheckoutHandler />
      </section>
    </>
  )
}
