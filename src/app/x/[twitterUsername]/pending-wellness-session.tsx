import cs from 'clsx'

import type * as types from '@/lib/types'
import { LoadingIndicator } from '@/components/loading-indicator'
import { UserAvatar } from '@/components/user-avatar'

import styles from './styles.module.css'

export function PendingWellnessSession({
  wellnessSession
}: {
  wellnessSession: types.WellnessSession
}) {
  const user = wellnessSession.twitterUser?.user

  return (
    <>
      <section className={cs(styles.intro)}>
        <h1 className={cs(styles.title, 'leading-none')}>
          Hello, {user?.name ?? user?.screen_name}
          <UserAvatar
            user={wellnessSession.twitterUser?.user}
            className='ml-4'
          />
        </h1>

        <p className={cs(styles.title, 'leading-none')}>
          This profile is being generated. This page will automatically refresh
          once it&apos;s ready.
        </p>
      </section>

      <section className='flex-auto justify-center p-16'>
        <LoadingIndicator isLoading={true} />
      </section>
    </>
  )
}
