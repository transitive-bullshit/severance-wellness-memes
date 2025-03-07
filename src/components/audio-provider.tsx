'use client'

import type * as React from 'react'
import type { SetOptional } from 'type-fest'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { useAudio as useAudioHook, useLocalStorage } from 'react-use'

const AudioContext = createContext({
  isAudioEnabled: true,
  isAudioAvailable: false,
  toggleAudio: () => {},
  refreshAudio: () => {}
})

export function AudioProvider({
  children,
  ...props
}: SetOptional<React.ComponentProps<typeof AudioContext.Provider>, 'value'>) {
  const [isAudioAvailable, setIsAudioAvailable] = useState(false)
  const [isAudioEnabled = true, setIsAudioEnabled] = useLocalStorage(
    'isAudioEnabled',
    true
  )

  const [audio, state, controls] = useAudioHook({
    src: '/music-of-wellness.mp3',
    autoPlay: false,
    loop: true,
    controls: true,
    preload: 'auto'
  })

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(!isAudioEnabled)
  }, [isAudioEnabled, setIsAudioEnabled])

  const refreshAudio = useCallback(() => {
    if (isAudioEnabled) {
      if (!state.playing) {
        console.log('playing audio')
      }

      controls
        .play()
        ?.then(() => {
          setIsAudioAvailable(true)
        })
        .catch(() => {
          setIsAudioAvailable(false)
        })
    } else {
      if (state.playing) {
        console.log('pausing audio')
      }

      controls.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudioEnabled])

  useEffect(() => {
    refreshAudio()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudioEnabled])

  return (
    <AudioContext.Provider
      {...props}
      value={{
        isAudioEnabled,
        isAudioAvailable,
        toggleAudio,
        refreshAudio
      }}
    >
      {/* Useful for debugging */}
      {/* <div className='w-full flex justify-center items-center'>{audio}</div> */}
      {children}

      <div className='hidden'>{audio}</div>
    </AudioContext.Provider>
  )
}

export function useAudio() {
  return useContext(AudioContext)
}
