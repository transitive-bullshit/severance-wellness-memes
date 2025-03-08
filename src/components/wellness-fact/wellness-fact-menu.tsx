'use client'

import ky from 'ky'
import {
  Check,
  ExternalLink,
  LoaderCircle,
  Menu,
  TriangleAlert
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
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

import { convertPngToJpg } from './convert-png-to-jpg'
import styles from './styles.module.css'

type Status = 'success' | 'error' | 'loading' | 'idle'

export function WellnessFactMenu({
  wellnessFact
}: {
  wellnessFact: types.WellnessFact
}) {
  const [status, setStatus] = useState<Status>('idle')
  const wellnessFactUrl = `${config.prodUrl}/x/${wellnessFact.twitterUsername}/o/${wellnessFact.id}`
  const twitterShareUrl = new URL('https://x.com/intent/tweet')
  twitterShareUrl.searchParams.set(
    'text',
    'This severance meme was created from my twitter profile using AI by @transitive_bs.\n\nPraise Kier.'
  )
  twitterShareUrl.searchParams.set('url', wellnessFactUrl)

  const onCopyText = useCallback(async () => {
    setStatus('loading')

    try {
      await navigator.clipboard.writeText(wellnessFact.text)

      toast.success('Copied text to clipboard')
      setStatus('success')
    } catch {
      toast.error('Error copying text to clipboard')
      setStatus('error')
    }
  }, [wellnessFact.text])

  const onCopyUrl = useCallback(async () => {
    setStatus('loading')

    try {
      await navigator.clipboard.writeText(wellnessFactUrl)

      toast.success('Copied URL to clipboard')
      setStatus('success')
    } catch {
      toast.error('Error copying URL to clipboard')
      setStatus('error')
    }
  }, [wellnessFactUrl])

  const onCopyImageAsPNG = useCallback(async () => {
    setStatus('loading')

    try {
      const blobP = ky.get(`${config.url}/o/${wellnessFact.id}/image`).blob()
      // Workaround for weird Safari bug
      // https://stackoverflow.com/questions/66312944/javascript-clipboard-api-write-does-not-work-in-safari
      const blob = config.isSafari ? await blobP : blobP
      const item = new ClipboardItem({ 'image/png': blob })
      await navigator.clipboard.write([item])

      toast.success('Copied image to clipboard')
      setStatus('success')
    } catch (err) {
      console.error('Error copying PNG image to clipboard', err)
      toast.error('Error copying image to clipboard')
      setStatus('error')
    }
  }, [wellnessFact])

  const onDownloadImageAsPNG = useCallback(async () => {
    setStatus('loading')

    try {
      const blob = await ky
        .get(`${config.url}/o/${wellnessFact.id}/image`)
        .blob()

      const link = document.createElement('a')
      link.download = `${wellnessFact.twitterUsername}-severance-meme-${wellnessFact.id}.png`
      link.href = URL.createObjectURL(blob)
      link.click()

      toast.success('Downloaded image')
      setStatus('success')
    } catch (err) {
      console.error('Error downloading PNG image', err)
      toast.error('Error downloading image')
      setStatus('error')
    }
  }, [wellnessFact])

  const onDownloadImageAsJPG = useCallback(async () => {
    setStatus('loading')

    try {
      const blob = await convertPngToJpg({
        input: `${config.url}/o/${wellnessFact.id}/image`
      })

      const link = document.createElement('a')
      link.download = `${wellnessFact.twitterUsername}-severance-meme-${wellnessFact.id}.jpg`
      link.href = URL.createObjectURL(blob)
      link.click()

      toast.success('Downloaded image')
      setStatus('success')
    } catch (err) {
      console.error('Error downloading JPG image', err)
      toast.error('Error downloading image')
      setStatus('error')
    }
  }, [wellnessFact])

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      setTimeout(() => setStatus('idle'), 2000)
    }
  }, [status])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className={styles.dropdownMenu}>
        <Button variant='secondary' size='icon' aria-label='Actions'>
          {status === 'success' ? (
            <Check />
          ) : status === 'loading' ? (
            <LoaderCircle className='animate-spin' />
          ) : status === 'error' ? (
            <TriangleAlert className='text-red-500' />
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

          <DropdownMenuItem className='cursor-pointer' onSelect={onCopyUrl}>
            Copy URL
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
            <Link href={twitterShareUrl.toString()} target='_blank'>
              Share on X / Twitter <ExternalLink />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
