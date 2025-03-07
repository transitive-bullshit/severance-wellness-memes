'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { type FormEvent, useEffect, useRef, useState } from 'react'

import { useAudio } from '@/components/audio-provider'

import styles from './styles.module.css'

interface AnimatedInputProps {
  twitterUsers: string[]
  className?: string
}

export function AnimatedInput({
  twitterUsers,
  className = ''
}: AnimatedInputProps) {
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
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Get a random subset of Twitter users to cycle through
  const randomUsers = useRef(
    [...twitterUsers]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10)
      // Ensure we always have at least one default user if the array is empty
      .concat(twitterUsers.length === 0 ? ['transitive_bs'] : [])
  ).current

  useEffect(() => {
    const currentUser = randomUsers[currentUserIndex] || 'username'

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
        }, 50)

        return () => clearTimeout(timeout)
      } else {
        // Move to next user
        const timeout = setTimeout(() => {
          setCurrentUserIndex((currentUserIndex + 1) % randomUsers.length)
          setIsTyping(true)
        }, 500)

        return () => clearTimeout(timeout)
      }
    }
  }, [currentUserIndex, isTyping, typingIndex, randomUsers])

  function getTwitterUsername() {
    // Remove @ symbol from the beginning if present
    const username = inputValue.trim().startsWith('@')
      ? inputValue.trim().slice(1)
      : inputValue.trim()

    return username
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const username = getTwitterUsername()

      // Start audio if it's enabled and not already playing
      if (isAudioEnabled) {
        refreshAudio()
      }

      router.push(`/x/${username}`)
    }
  }

  const twitterUsername = getTwitterUsername()

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.inputWrapper} ${className}`}
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
