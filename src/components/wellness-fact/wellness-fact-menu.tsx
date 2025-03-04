'use client'

import ky from 'ky'
import { Check, ExternalLink, LoaderCircle, Menu } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

import type * as types from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import * as config from '@/lib/config'

import styles from './styles.module.css'

export function WellnessFactMenu({
  wellnessFact
}: {
  wellnessFact: types.WellnessFact
}) {
  const [isDone, setIsDone] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const onCopyText = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(wellnessFact.text)

      toast.success('Copied text to clipboard')
    } catch {
      toast.error('Error copying text to clipboard')
    }

    setIsDone(true)
  }, [wellnessFact.text])

  const onCopyImageAsPNG = React.useCallback(async () => {
    setIsDone(false)
    setIsLoading(true)

    try {
      const blob = await ky
        .get(`${config.url}/o/${wellnessFact.id}/image`)
        .blob()
      const item = new ClipboardItem({ 'image/png': blob })
      await navigator.clipboard.write([item])

      toast.success('Copied image to clipboard')
    } catch {
      toast.error('Error copying image to clipboard')
    }

    setIsDone(true)
  }, [wellnessFact])

  const onDownloadImageAsPNG = React.useCallback(async () => {
    setIsDone(false)
    setIsLoading(true)

    try {
      const blob = await ky
        .get(`${config.url}/o/${wellnessFact.id}/image`)
        .blob()

      const link = document.createElement('a')
      link.download = `${wellnessFact.twitterUsername}-severance-meme-${wellnessFact.id}.png`
      link.href = URL.createObjectURL(blob)
      link.click()

      toast.success('Downloaded image')
    } catch {
      toast.error('Error downloading image')
    }

    setIsDone(true)
  }, [wellnessFact])

  const onDownloadImageAsJPG = React.useCallback(async () => {
    setIsDone(false)
    setIsLoading(true)

    try {
      const blob = await convertPngToJpg({
        input: `${config.url}/o/${wellnessFact.id}/image`
      })

      const link = document.createElement('a')
      link.download = `${wellnessFact.twitterUsername}-severance-meme-${wellnessFact.id}.jpg`
      link.href = URL.createObjectURL(blob)
      link.click()

      toast.success('Downloaded image')
    } catch {
      toast.error('Error downloading image')
    }

    setIsDone(true)
  }, [wellnessFact])

  React.useEffect(() => {
    if (isDone) {
      setIsLoading(false)
      setTimeout(() => setIsDone(false), 2000)
    }
  }, [isDone])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className={styles.dropdownMenu}>
        <Button variant='secondary' size='icon'>
          {isDone ? (
            <Check />
          ) : isLoading ? (
            <LoaderCircle className='animate-spin' />
          ) : (
            <Menu />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuItem className='cursor-pointer' onSelect={onCopyText}>
            Copy Text
          </DropdownMenuItem>

          <DropdownMenuItem
            className='cursor-pointer'
            onSelect={onCopyImageAsPNG}
          >
            Copy Image as PNG
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className='cursor-pointer'
            onSelect={onDownloadImageAsPNG}
          >
            Download Image as PNG
          </DropdownMenuItem>

          <DropdownMenuItem
            className='cursor-pointer'
            onSelect={onDownloadImageAsJPG}
          >
            Download Image as JPG
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className='cursor-pointer' asChild>
            <Link
              href={`https://x.com/intent/tweet?text=${'Praise Kier.'}&url=${config.prodUrl}/x/${wellnessFact.twitterUsername}/o/${wellnessFact.id}`}
              target='_blank'
            >
              Share on X / Twitter <ExternalLink />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Converts a PNG image to JPG format.
 * @param {Blob|string} input - PNG image as Blob or URL string
 * @param {number} quality - JPEG quality (0 to 1)
 * @returns {Promise<Blob>} - JPG image as Blob
 */
async function convertPngToJpg({
  input,
  quality = 0.8
}: {
  input: string | Blob
  quality?: number
}): Promise<Blob> {
  // Create an Image object
  const img = new Image()

  // Create a canvas element
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  // Create a promise to handle the image loading
  return new Promise((resolve, reject) => {
    img.addEventListener('load', () => {
      try {
        // Set canvas dimensions to match the image
        canvas.width = img.width
        canvas.height = img.height

        // Draw the image onto the canvas
        ctx.fillStyle = '#111111'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)

        // Convert canvas content to JPG
        canvas.toBlob(
          (blob) => {
            resolve(blob!)
          },
          'image/jpeg',
          quality
        )
      } catch (err) {
        reject(err)
      }
    })

    img.addEventListener('error', () => {
      reject(new Error('Failed to load image'))
    })

    // Set the source of the image
    if (typeof input === 'string') {
      // If input is a URL
      img.src = input
    } else {
      // If input is a Blob
      img.src = URL.createObjectURL(input)
    }
  })
}
