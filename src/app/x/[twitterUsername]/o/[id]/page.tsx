import type { Metadata, ResolvingMetadata } from 'next'
import { pruneNullOrUndefined } from '@agentic/core'
import { unstable_cache as cache } from 'next/cache'
import { notFound } from 'next/navigation'

import { GenerateWellnessSessionCTA } from '@/components/generate-wellness-session-cta'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { WellnessFact } from '@/components/wellness-fact'
import { featuredTwitterUsers } from '@/data/featured-twitter-users'
import * as config from '@/lib/config'
import { prisma } from '@/lib/db'
import { getWellnessFactById } from '@/lib/db/queries'
import { getOrUpsertWellnessSession } from '@/lib/get-or-upsert-wellness-session'

export default async function Page({
  params
}: {
  params: Promise<{ id: string; twitterUsername: string }>
}) {
  const { id: wellnessFactId, twitterUsername } = await params
  const wellnessFact = await getWellnessFactById(wellnessFactId)
  if (!wellnessFact) return notFound()

  return (
    <>
      <section className='w-full flex-auto flex flex-col items-center justify-center'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/' className='link'>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href={`/x/${twitterUsername}`} className='link'>
                {twitterUsername}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Wellness Fact</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>

      <section className='flex flex-col items-center justify-center'>
        <WellnessFact wellnessFact={wellnessFact} />
      </section>

      <section>
        <GenerateWellnessSessionCTA />
      </section>
    </>
  )
}

export async function generateStaticParams() {
  const featuredWellnessSessions = await prisma.wellnessSession.findMany({
    where: {
      twitterUsername: {
        in: featuredTwitterUsers.map((user) => user.twitterUsername)
      }
    },
    select: {
      wellnessFacts: {
        select: {
          id: true,
          twitterUsername: true
        }
      }
    }
  })

  const featuredWellnessFacts = await prisma.wellnessFact.findMany({
    where: {
      tags: {
        has: 'featured'
      }
    },
    select: {
      id: true,
      twitterUsername: true
    }
  })

  // Join wellness facts from featured users and featured wellness facts
  const wellnessFacts = [
    ...featuredWellnessSessions.flatMap(({ wellnessFacts }) => wellnessFacts),
    ...featuredWellnessFacts
  ]

  // Remove duplicates
  return Object.values(
    Object.fromEntries(
      wellnessFacts.map(({ twitterUsername, id }) => [
        id,
        { twitterUsername, id }
      ])
    )
  )
}

export async function generateMetadata(
  {
    params
  }: {
    params: Promise<{ id: string; twitterUsername: string }>
  },
  parentP: ResolvingMetadata
): Promise<Metadata> {
  const { id: wellnessFactId, twitterUsername } = await params
  const wellnessFact = await getWellnessFactById(wellnessFactId)
  if (!wellnessFact) return {}

  const getWellnessSession = cache(getOrUpsertWellnessSession, [
    `wellness-session-${twitterUsername}`
  ])

  const wellnessSession = await getWellnessSession({ twitterUsername })
  if (!wellnessSession) return {}

  if (wellnessSession.status !== 'resolved') {
    return {}
  }

  const { userFullName, twitterUser } = wellnessSession

  const user = twitterUser!.user!
  const userFullNameParts = userFullName
    ?.split(' ')
    .map((s: string) => s.trim())
    .filter(Boolean)
  const userDisplayName =
    userFullName && userFullNameParts!.length === 2
      ? `${userFullNameParts![0]} ${userFullNameParts![1]![0]}.`
      : userFullName || user.name || user.screen_name || 'Mysterious Guest'

  const title = `Severance Wellness Fact for ${userDisplayName}`
  const description = wellnessFact.text
  const parent = await parentP

  return {
    title,
    description,
    openGraph: pruneNullOrUndefined({
      ...parent.openGraph,
      title,
      description,
      images: `${config.prodUrl}/x/${twitterUsername}/o/${wellnessFactId}/opengraph-image`
    }),
    twitter: pruneNullOrUndefined({
      ...parent.twitter,
      title,
      description,
      images: `${config.prodUrl}/x/${twitterUsername}/o/${wellnessFactId}/twitter-image`
    })
  }
}
