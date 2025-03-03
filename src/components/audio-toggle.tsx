'use client'

import { Volume2, VolumeX } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'

export function AudioToggle() {
  // const { setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      variant='outline'
      size='icon'
      className='cursor-pointer'
      // TODO
      // onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Volume2 className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all' />
      <VolumeX className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all' />
      <span className='sr-only'>Toggle music</span>
    </Button>
  )
}
