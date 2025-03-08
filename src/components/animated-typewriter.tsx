'use client'

import cs from 'clsx'
import { useEffect, useState } from 'react'

export function AnimatedTypewriter({
  text,
  speed = 40,
  className
}: {
  text: string
  speed?: number
  className?: string
}) {
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

  return <h5 className={cs(className)}>{displayedText}</h5>
}
