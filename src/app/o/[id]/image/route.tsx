import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'

import { prisma } from '~/lib/db'

export const dynamic = 'force-static'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: wellnessFactId } = await params
  const [wellnessFactBg, inter, wellnessFact] = await Promise.all([
    readFile(path.join(process.cwd(), 'public/wellness-fact-bg.jpg')),
    readFile(path.join(process.cwd(), 'public/fonts/inter-light.ttf')),
    prisma.wellnessFact.findUnique({
      where: { id: wellnessFactId },
      select: { text: true }
    })
  ])
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
              textWrap: 'balance'
            }}
          >
            {wellnessFact?.text || 'The work is mysterious and important.'}
          </div>
        </div>
      </div>
    ),
    {
      width: 2048,
      height: 1024,
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
