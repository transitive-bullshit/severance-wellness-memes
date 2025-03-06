import cs from 'clsx'

import type * as types from '@/lib/types'

import styles from './styles.module.css'

export function PendingWellnessSession({
  wellnessSession
}: {
  wellnessSession: types.WellnessSession
}) {
  return (
    <>
      <section className={cs(styles.intro)}>
        <h1 className={cs(styles.title, 'leading-none')}>
          This profile is being processed. Refresh the page in a few minutes.
        </h1>

        <p>{JSON.stringify(wellnessSession)}</p>
      </section>
    </>
  )
}
