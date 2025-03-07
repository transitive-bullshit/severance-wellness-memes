'use client'

import { Loader2, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'

import type * as types from '@/lib/types'
import { Button } from '@/components/ui/button'
import { numTwitterTweetsProcessed } from '@/lib/config'
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
    initCheckoutSession({ twitterUsername }).catch(() => setIsLoading(false))
  }, [twitterUsername])

  const price = '$8'
  const tier = {
    name: 'Severance Meme Pack',
    description: <>This profile hasn&apos;t been generated yet.</>,
    footnote: (
      <>
        Note: I have to charge because we&apos;re using the latest model from
        OpenAI (GPT-4.5) to generate the memes – which is expensive and I need
        to help cover the costs.
      </>
    ),
    price,
    highlights: [
      {
        description: (
          <span>
            Pack of custom memes based on <i>@{twitterUsername}</i>
            twitter profile
          </span>
        )
      },
      {
        description: (
          <span>
            Uses the last {numTwitterTweetsProcessed} tweets from{' '}
            <i>@{twitterUsername}</i>
          </span>
        )
      },
      { description: 'Download the memes as PNG or JPG' },
      { description: 'Easily share them to Twitter / X / Reddit' },
      { description: 'Payment is handled securely by Stripe' }
    ]
  }

  return (
    <div
      key={tier.name}
      className='grid grid-cols-1 rounded-[2rem] shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:w-full max-lg:max-w-md max-w-lg'
    >
      <div className='grid grid-cols-1 rounded-[2rem] p-2 shadow-md shadow-black/5'>
        <div className='rounded-3xl bg-white p-8 pb-9 shadow-2xl ring-1 ring-black/5'>
          <h2 className='text-sm font-semibold text-indigo-600 mb-0!'>
            {tier.name} <span className='sr-only'>plan</span>
          </h2>

          <p className='mt-2 text-pretty text-sm/6 text-gray-600'>
            {tier.description}
          </p>

          <div className='mt-6 flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='text-5xl font-semibold text-gray-950'>
                {tier.price}
              </div>

              <div className='text-sm text-gray-600'>
                <p>USD</p>
              </div>
            </div>

            <Button
              disabled={isLoading}
              className='cursor-pointer select-none flex flex-col align-center justify-center
              rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
              '
              onClick={onGenerateProfile}
            >
              {isLoading ? (
                <span>
                  <Loader2 className='inline-block animate-spin mr-2' />
                  Loading stripe...
                </span>
              ) : (
                <span>Generate your memes</span>
              )}
            </Button>
          </div>

          <div className='mt-6'>
            <h4 className='text-sm/6 font-medium text-gray-950 mb-0!'>
              Features:
            </h4>

            <ul className='mt-3 space-y-1'>
              {tier.highlights.map((highlight, index) => (
                <li
                  key={index}
                  className='group flex items-start gap-3 text-sm/6 text-gray-600 data-[disabled]:text-gray-400'
                >
                  <span className='inline-flex h-6 items-center'>
                    <Plus
                      aria-hidden='true'
                      className='size-4 fill-gray-400 group-data-[disabled]:fill-gray-300'
                    />
                  </span>

                  {highlight.description}
                </li>
              ))}
            </ul>
          </div>

          <div className='mt-6'>
            <p className='mt-2 text-pretty text-xs/5 text-gray-400'>
              {tier.footnote}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
