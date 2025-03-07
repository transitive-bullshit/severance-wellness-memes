'use client'

import { motion } from 'framer-motion'

import styles from '@/app/styles.module.css'
import { AnimatedInput } from '@/components/animated-input'
import { AnimatedTypewriter } from '@/components/animated-typewriter'
import { seedTwitterUsers } from '@/data/seed-twitter-users'

export function AnimatedHeroSection() {
  return (
    <section className={styles.intro}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Severance Wellness Session
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <AnimatedTypewriter text='Create custom severance memes based on your Twitter profile.' />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className='w-full max-w-md'
      >
        <AnimatedInput twitterUsers={seedTwitterUsers} />
      </motion.div>
    </section>
  )
}
