'use client'

import { useEffect, useState } from 'react'

interface AnimatedTypewriterProps {
  text: string
  speed?: number
  className?: string
}

export function AnimatedTypewriter({
  text,
  speed = 40,
  className = ''
}: AnimatedTypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return <h5 className={className}>{displayedText}</h5>
}
