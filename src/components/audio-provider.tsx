'use client'

import type { SetOptional } from 'type-fest'
import React from 'react'
import {
  useAudio as useAudioHook,
  useEffectOnce,
  useLocalStorage
} from 'react-use'

const AudioContext = React.createContext({
  isAudioEnabled: true,
  toggleAudio: () => {}
})

export function AudioProvider({
  children,
  ...props
}: SetOptional<React.ComponentProps<typeof AudioContext.Provider>, 'value'>) {
  const [isAudioEnabled = true, setIsAudioEnabled] = useLocalStorage(
    'audio',
    true
  )
  const [isMounted, setIsMounted] = React.useState(false)

  useEffectOnce(() => {
    setIsMounted(true)

    if (isAudioEnabled) {
      controls.play()
    } else {
      controls.pause()
    }
  })

  const [audio, _state, controls] = useAudioHook({
    src: '/music-of-wellness.mp3',
    autoPlay: isAudioEnabled,
    loop: true
  })

  const toggleAudio = React.useCallback(() => {
    setIsAudioEnabled(!isAudioEnabled)
  }, [isAudioEnabled, setIsAudioEnabled])

  React.useEffect(() => {
    if (isAudioEnabled) {
      controls.play()
    } else {
      controls.pause()
    }
  }, [isAudioEnabled, controls])

  return (
    <AudioContext.Provider
      {...props}
      value={{
        isAudioEnabled,
        toggleAudio
      }}
    >
      {children}

      {isMounted && <div className='hidden'>{audio}</div>}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  return React.useContext(AudioContext)
}
