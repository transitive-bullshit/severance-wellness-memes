import { notFound } from 'next/navigation'

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
import { prisma } from '@/lib/db'

export default async function Page({
  params
}: {
  params: Promise<{ id: string; twitterUsername: string }>
}) {
  const { id: wellnessFactId, twitterUsername } = await params

  const wellnessFact = await prisma.wellnessFact.findUnique({
    where: {
      id: wellnessFactId
    }
  })
  if (!wellnessFact) {
    return notFound()
  }

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

      <section className='flex-auto flex flex-col items-center justify-center'>
        <WellnessFact wellnessFact={wellnessFact} />
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
      twitterUsername: true,
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
