'use client'

import { Volume2, VolumeX } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { useAudio } from './theme-provider'

export function AudioToggle() {
  const { isAudioEnabled, toggleAudio } = useAudio()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='cursor-pointer'
            onClick={toggleAudio}
          >
            {isAudioEnabled ? (
              <Volume2 className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all' />
            ) : (
              <VolumeX className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all' />
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
