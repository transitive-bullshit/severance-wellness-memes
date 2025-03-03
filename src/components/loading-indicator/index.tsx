'use client'

import type React from 'react'
import cs from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import Lottie from 'react-lottie-player'

import loadingDark from './loading-dark.json'
import loadingLight from './loading-light.json'
import styles from './styles.module.css'

export function LoadingIndicator({
  isLoading = false,
  fill = false,
  className,
  initial,
  animate,
  exit,
  ...rest
}: {
  isLoading?: boolean
  fill?: boolean
  className?: string
  initial?: any
  animate?: any
  exit?: any
}) {
  const { resolvedTheme } = useTheme()

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={cs(styles.loading, fill && styles.fill, className)}
          initial={{ opacity: 1, ...initial }}
          animate={{ opacity: 1, ...animate }}
          exit={{ opacity: 0, ...exit }}
          {...rest}
        >
          <Lottie
            play
            loop
            animationData={
              resolvedTheme === 'dark' ? loadingDark : loadingLight
            }
            className={styles.loadingAnimation}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
