import cs from 'clsx'

import type * as types from '@/lib/types'
import { UserAvatar } from '@/components/user-avatar'

import styles from './styles.module.css'

export function ErrorWellnessSession({
  wellnessSession
}: {
  wellnessSession: types.WellnessSession
}) {
  const user = wellnessSession.twitterUser?.user

  return (
    <>
      <section className={cs(styles.intro)}>
        <h1 className={cs(styles.title, 'leading-none')}>
          {user?.name ?? user?.screen_name}
          <UserAvatar
            user={wellnessSession.twitterUser?.user}
            className='ml-4'
          />
        </h1>

        <p>
          There was an error processing this profile. Please contact support and
          include this URL.
        </p>
      </section>
    </>
  )
}
