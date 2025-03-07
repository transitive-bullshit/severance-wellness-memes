'use client'

import cs from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

import type * as types from '@/lib/types'

import { WellnessFact } from '../wellness-fact'
import styles from './styles.module.css'

interface WellnessFactGalleryProps {
  wellnessFacts: types.WellnessFact[] | undefined
  className?: string
  isLoading?: boolean
}

export function WellnessFactGallery({
  wellnessFacts = [],
  className,
  isLoading = false
}: WellnessFactGalleryProps) {
  // If loading or no facts, show skeleton
  const showSkeleton = isLoading || wellnessFacts.length === 0

  return (
    <div className={cs(styles.wellnessFactGallery, className)}>
      <AnimatePresence mode='wait'>
        {showSkeleton
          ? // Skeleton loading state
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                className='h-[300px] w-full rounded-lg animate-pulse bg-muted'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.5
                }}
              />
            ))
          : // Actual content
            wellnessFacts.map((wellnessFact, index) => (
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
