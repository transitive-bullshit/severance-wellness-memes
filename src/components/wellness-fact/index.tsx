import cs from 'clsx'
import Image from 'next/image'
import { Suspense, use } from 'react'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'
import { isPromiseLike } from '@/lib/utils'

import styles from './styles.module.css'
import { WellnessFactMenu } from './wellness-fact-menu'

const blurDataUrl =
  'data:image/jpeg;base64,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'

export function WellnessFact({
  wellnessFact,
  priority,
  className
}: {
  wellnessFact: Promise<types.WellnessFact | null> | types.WellnessFact
  priority?: boolean
  className?: string
}) {
  return (
    <Suspense fallback={<WellnessFactSkeleton />}>
      {isPromiseLike(wellnessFact) ? (
        <WellnessFactP
          wellnessFact={wellnessFact}
          className={className}
          priority={priority}
        />
      ) : (
        <WellnessFactImpl
          wellnessFact={wellnessFact}
          className={className}
          priority={priority}
        />
      )}
    </Suspense>
  )
}

function WellnessFactP({
  wellnessFact: wellnessFactP,
  priority,
  className
}: {
  wellnessFact: Promise<types.WellnessFact | null>
  priority?: boolean
  className?: string
}) {
  const wellnessFact = use(wellnessFactP)
  if (!wellnessFact) return null

  return (
    <WellnessFactImpl
      wellnessFact={wellnessFact}
      className={className}
      priority={priority}
    />
  )
}

function WellnessFactImpl({
  wellnessFact,
  priority,
  className
}: {
  wellnessFact: types.WellnessFact
  priority?: boolean
  className?: string
}) {
  return (
    <div className={cs(styles.wellnessFactContainer, className)}>
      <Image
        className={styles.wellnessFact}
        src={`${config.isDev ? '' : config.prodUrl}/o/${wellnessFact.id}/image`}
        placeholder='blur'
        blurDataURL={blurDataUrl}
        alt={wellnessFact.text}
        priority={priority}
        fill
      />

      <WellnessFactMenu wellnessFact={wellnessFact} />
    </div>
  )
}

export function WellnessFactSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cs(
        styles.wellnessFactContainer,
        'rounded-lg animate-pulse bg-muted',
        className
      )}
    />
  )
}
