'use client'

import cs from 'clsx'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import random from 'random'
import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react'

import { useAudio } from '@/components/audio-provider'
import { featuredTwitterUsers } from '@/data/featured-twitter-users'

import styles from './styles.module.css'

const twitterUsers = random
  .shuffle(featuredTwitterUsers.map((u) => u.twitterUsername.toLowerCase()))
  .slice(0, 10)

export function AnimatedInput({
  focused = false,
  className
}: {
  focused?: boolean
  className?: string
}) {
  const [placeholder, setPlaceholder] = useState('')
  const [currentUserIndex, setCurrentUserIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [typingIndex, setTypingIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { isAudioEnabled, refreshAudio } = useAudio()

  // Focus the input field on mount
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [focused])

  useEffect(() => {
    const currentUser = twitterUsers[currentUserIndex] || 'username'

    if (isTyping) {
      // Typing animation
      if (typingIndex < currentUser.length) {
        const timeout = setTimeout(() => {
          setPlaceholder(currentUser.slice(0, Math.max(0, typingIndex + 1)))
          setTypingIndex(typingIndex + 1)
        }, 100)

        return () => clearTimeout(timeout)
      } else {
        // Pause at the end of typing
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 1500)

        return () => clearTimeout(timeout)
      }
    } else {
      // Deleting animation
      if (typingIndex > 0) {
        const timeout = setTimeout(() => {
          setPlaceholder(currentUser.slice(0, Math.max(0, typingIndex - 1)))
          setTypingIndex(typingIndex - 1)
        }, 10)

        return () => clearTimeout(timeout)
      } else {
        // Move to next user
        const timeout = setTimeout(() => {
          setCurrentUserIndex((currentUserIndex + 1) % twitterUsers.length)
          setIsTyping(true)
        }, 500)

        return () => clearTimeout(timeout)
      }
    }
  }, [currentUserIndex, isTyping, typingIndex])

  const getTwitterUsername = useCallback(() => {
    // Remove @ symbol from the beginning if present
    const username = inputValue.trim().startsWith('@')
      ? inputValue.trim().slice(1)
      : inputValue.trim()

    return username
  }, [inputValue])

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      const username = getTwitterUsername()

      if (username) {
        // Start audio if it's enabled and not already playing
        if (isAudioEnabled) {
          refreshAudio()
        }

        router.push(`/x/${username}`)
      }
    },
    [isAudioEnabled, router, refreshAudio, getTwitterUsername]
  )

  const twitterUsername = getTwitterUsername()

  return (
    <form
      onSubmit={handleSubmit}
      className={cs(
        styles.inputWrapper,
        'flex gap-4 flex-col md:flex-row',
        className
      )}
      autoComplete='off'
    >
      <input
        ref={inputRef}
        data-1p-ignore
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={`@${placeholder}`}
        className={styles.input}
        aria-label='Twitter username'
        autoFocus
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
        data-form-type='other'
        data-lpignore='true'
      />

      <motion.button
        type='submit'
        className={styles.submitButton}
        whileHover={twitterUsername ? { scale: 1.05 } : {}}
        whileTap={twitterUsername ? { scale: 0.95 } : {}}
        disabled={!twitterUsername}
      >
        Generate memes
      </motion.button>
    </form>
  )
}
