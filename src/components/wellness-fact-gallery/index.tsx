'use client'

import cs from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, use } from 'react'

import type * as types from '@/lib/types'
import { isPromiseLike } from '@/lib/utils'

import { WellnessFact, WellnessFactSkeleton } from '../wellness-fact'
import styles from './styles.module.css'

export function WellnessFactGallery({
  wellnessFacts,
  className
}: {
  wellnessFacts: Promise<(types.WellnessFact | null)[]> | types.WellnessFact[]
  className?: string
}) {
  return (
    <Suspense fallback={<WellnessFactGallerySkeleton />}>
      {isPromiseLike(wellnessFacts) ? (
        <WellnessFactGalleryP
          wellnessFacts={wellnessFacts}
          className={className}
        />
      ) : (
        <WellnessFactGalleryImpl
          wellnessFacts={wellnessFacts}
          className={className}
        />
      )}
    </Suspense>
  )
}

function WellnessFactGalleryP({
  wellnessFacts: wellnessFactsP,
  className
}: {
  wellnessFacts: Promise<(types.WellnessFact | null)[]>
  className?: string
}) {
  const wellnessFacts = use(wellnessFactsP).filter(Boolean)

  return (
    <WellnessFactGalleryImpl
      wellnessFacts={wellnessFacts}
      className={className}
    />
  )
}

function WellnessFactGalleryImpl({
  wellnessFacts,
  className
}: {
  wellnessFacts: types.WellnessFact[]
  className?: string
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
              duration: 0.5,
              ease: 'easeOut'
            }}
          >
            <WellnessFact wellnessFact={wellnessFact} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function WellnessFactGallerySkeleton({
  className,
  numberOfItems = 4
}: {
  className?: string
  numberOfItems?: number
}) {
  return (
    <div className={cs(styles.wellnessFactGallery, className)}>
      {Array.from({ length: numberOfItems }).map((_, i) => (
        <WellnessFactSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  )
}
