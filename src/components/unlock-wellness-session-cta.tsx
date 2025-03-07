'use client'

import { Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'

import type * as types from '@/lib/types'
import { Button } from '@/components/ui/button'
import { initCheckoutSession } from '@/lib/db/actions'

export function UnlockWellnessSessionCTA({
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
    <div className='flex flex-col gap-4'>
      <Button
        disabled={isLoading}
        className='cursor-pointer select-none'
        onClick={onGenerateProfile}
      >
        {isLoading ? (
          <>
            <Loader2 className='animate-spin' />
            Loading...
          </>
        ) : (
          'Generate profile ($8 USD)'
        )}
      </Button>
    </div>
  )
}
