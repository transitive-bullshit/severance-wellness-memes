'use client'

import cs from 'clsx'

import type * as types from '@/lib/types'
import { Button } from '@/components/ui/button'
import { initCheckoutSession } from '@/lib/db/actions'

import styles from './styles.module.css'

export function LockedWellnessSession({
  wellnessSession
}: {
  wellnessSession: types.WellnessSession
}) {
  const { twitterUsername } = wellnessSession

  return (
    <>
      <section className={cs(styles.intro)}>
        <h1 className={cs(styles.title, 'leading-none')}>
          This profile has not been processed yet.
        </h1>

        <p>{JSON.stringify(wellnessSession)}</p>

        <p>
          <Button onClick={() => initCheckoutSession({ twitterUsername })}>
            Generate profile
          </Button>
        </p>
      </section>
    </>
  )
}
