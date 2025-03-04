'use client'

import { Volume2, VolumeX } from 'lucide-react'
import React from 'react'
import { useEffectOnce } from 'react-use'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { useAudio } from './audio-provider'

export function AudioToggle() {
  const { isAudioEnabled, toggleAudio } = useAudio()
  const [isMounted, setIsMounted] = React.useState(false)

  useEffectOnce(() => {
    setIsMounted(true)
  })

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='cursor-pointer'
            onClick={toggleAudio}
            suppressHydrationWarning
          >
            {isAudioEnabled && isMounted ? (
              <Volume2 className='h-[1.2rem] w-[1.2rem]' />
            ) : (
              <VolumeX className='h-[1.2rem] w-[1.2rem]' />
            )}
            <span className='sr-only'>Toggle music</span>
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <span>Toggle music</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
