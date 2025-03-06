'use client'

import type { SetOptional } from 'type-fest'
import React, { createContext, useCallback, useEffect, useState } from 'react'
import { useAudio as useAudioHook } from 'react-use'

const AudioContext = createContext({
  isAudioEnabled: false,
  toggleAudio: () => {}
})

export function AudioProvider({
  children,
  ...props
}: SetOptional<React.ComponentProps<typeof AudioContext.Provider>, 'value'>) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)

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

  useEffect(() => {
    if (isAudioEnabled) {
      if (!state.playing) {
        console.log('playing audio')
      }
      controls.play()
    } else {
      if (state.playing) {
        console.log('pausing audio')
      }
      controls.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudioEnabled])

  return (
    <AudioContext.Provider
      {...props}
      value={{
        isAudioEnabled,
        toggleAudio
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
  return React.useContext(AudioContext)
}
