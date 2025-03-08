import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'

import { getWellnessFactById } from '@/lib/db/queries'

// TODO: text with certain symbols like '@' produces a text overflow with `text-wrap: balance`
// 'Your outie’s favorite form of self-care is releasing pricing update tweets for @vercel several times a month.'

export async function generateWellnessFactImageResponse({
  wellnessFactId,
  content
}: {
  wellnessFactId?: string
  content?: ReactNode
}): Promise<ImageResponse> {
  const [wellnessFactBg, inter, wellnessFact] = await Promise.all([
    readFile(path.join(process.cwd(), 'public/wellness-fact-bg.jpg')),
    readFile(path.join(process.cwd(), 'public/fonts/inter-light.ttf')),
    wellnessFactId ? getWellnessFactById(wellnessFactId) : Promise.resolve(null)
  ])

  if (!wellnessFact && !content) {
    return notFound()
  }

  const wellnessFactBgUrl = `data:image/jpeg;base64,${wellnessFactBg.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          background: '#111',
          backgroundImage: `url(${wellnessFactBgUrl})`,
          backgroundSize: 'cover',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '40%',
            right: '0',
            bottom: '0',
            padding: '2% 4%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              fontFamily: 'Inter',
              fontSize: '86px',
              lineHeight: '1.35',
              color: '#eee',
              textAlign: 'center',
              textWrap: 'balance',
              display: content ? 'flex' : 'block'
            }}
          >
            {wellnessFact
              ? wellnessFact.text?.replaceAll(/[#@]/g, '') ||
                'The work is mysterious and important.'
              : content}

            {/* {'Your outie loves creating viral Severance memes.'} */}
          </div>
        </div>
      </div>
    ),
    {
      width: 2048,
      height: 1024,
      // debug: true,
      fonts: [
        {
          name: 'Inter',
          data: inter,
          style: 'normal',
          weight: 300
        }
      ]
    }
  )
}
