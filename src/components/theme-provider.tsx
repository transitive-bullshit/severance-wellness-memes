'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react'
import { useAudio as useAudioHook, useLocalStorage } from 'react-use'

const audioContext = React.createContext({
  isAudioEnabled: false,
  toggleAudio: () => {}
})

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [isAudioEnabled = false, setIsAudioEnabled] = useLocalStorage(
    'audio',
    true
  )
  const [audio, _state, controls] = useAudioHook({
    src: '/music-of-wellness.mp3',
    autoPlay: false,
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
    <NextThemesProvider {...props}>
      <audioContext.Provider
        value={{
          isAudioEnabled,
          toggleAudio
        }}
      >
        {children}

        <div className='hidden'>{audio}</div>
      </audioContext.Provider>
    </NextThemesProvider>
  )
}

export function useAudio() {
  return React.useContext(audioContext)
}
