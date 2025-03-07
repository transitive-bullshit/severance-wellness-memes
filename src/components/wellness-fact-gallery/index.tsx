'use client'

import cs from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, use } from 'react'

import type * as types from '@/lib/types'
import { isPromiseLike } from '@/lib/utils'

import { WellnessFact } from '../wellness-fact'
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
      <AnimatePresence mode='wait'>
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

function WellnessFactGallerySkeleton({ className }: { className?: string }) {
  return (
    <div className={cs(styles.wellnessFactGallery, className)}>
      <AnimatePresence mode='wait'>
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`skeleton-${i}`}
            className='h-[300px] w-full rounded-lg animate-pulse bg-muted'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: i * 0.1,
              duration: 0.5
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
