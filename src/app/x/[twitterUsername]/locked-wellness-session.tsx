'use client'

import cs from 'clsx'
import { Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'

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
  const [isLoading, setIsLoading] = useState(false)

  const onGenerateProfile = useCallback(() => {
    setIsLoading(true)
    initCheckoutSession({ twitterUsername }).finally(() => setIsLoading(false))
  }, [twitterUsername])

  return (
    <>
      <section className={cs(styles.intro)}>
        <h1 className={cs(styles.title, 'leading-none')}>
          This profile has not been processed yet.
        </h1>

        <p>{JSON.stringify(wellnessSession)}</p>

        <p>
          <Button
            disabled={isLoading}
            className='cursor-pointer select-none'
            onClick={onGenerateProfile}
          >
            {isLoading ? (
              <>
                <Loader2 className='animate-spin' />
                Redirecting...
              </>
            ) : (
              'Generate profile ($8 USD)'
            )}
          </Button>
        </p>
      </section>
    </>
  )
}
