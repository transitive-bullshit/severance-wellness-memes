'use client'

import cs from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { Suspense, use } from 'react'

import type * as types from '@/lib/types'
import { isPromiseLike } from '@/lib/utils'

import { WellnessFact, WellnessFactSkeleton } from '../wellness-fact'
import styles from './styles.module.css'

export function WellnessFactGallery({
  wellnessFacts,
  className,
  estimatedNumItems,
  priority
}: {
  wellnessFacts: Promise<(types.WellnessFact | null)[]> | types.WellnessFact[]
  className?: string
  estimatedNumItems?: number
  priority?: boolean
}) {
  return (
    <Suspense
      fallback={
        <WellnessFactGallerySkeleton estimatedNumItems={estimatedNumItems} />
      }
    >
      {isPromiseLike(wellnessFacts) ? (
        <WellnessFactGalleryP
          wellnessFacts={wellnessFacts}
          className={className}
          priority={priority}
        />
      ) : (
        <WellnessFactGalleryImpl
          wellnessFacts={wellnessFacts}
          className={className}
          priority={priority}
        />
      )}
    </Suspense>
  )
}

function WellnessFactGalleryP({
  wellnessFacts: wellnessFactsP,
  className,
  priority
}: {
  wellnessFacts: Promise<(types.WellnessFact | null)[]>
  className?: string
  priority?: boolean
}) {
  const wellnessFacts = use(wellnessFactsP).filter(Boolean)

  return (
    <WellnessFactGalleryImpl
      wellnessFacts={wellnessFacts}
      className={className}
      priority={priority}
    />
  )
}

function WellnessFactGalleryImpl({
  wellnessFacts,
  className,
  priority
}: {
  wellnessFacts: types.WellnessFact[]
  className?: string
  priority?: boolean
}) {
  return (
    <div className={cs(styles.wellnessFactGallery, className)}>
      <AnimatePresence>
        {wellnessFacts.map((wellnessFact, index) => (
          <motion.div
            key={wellnessFact.id}
            className='w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.3,
              ease: 'easeOut'
            }}
          >
            <WellnessFact
              wellnessFact={wellnessFact}
              priority={priority && index < 2}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function WellnessFactGallerySkeleton({
  className,
  estimatedNumItems = 4
}: {
  className?: string
  estimatedNumItems?: number
}) {
  return (
    <div className={cs(styles.wellnessFactGallery, className)}>
      {Array.from({ length: estimatedNumItems }).map((_, i) => (
        <WellnessFactSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  )
}
