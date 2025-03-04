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
import { seedTwitterUsers } from '@/data/seed-twitter-users'
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
  const wellnessFacts = await prisma.wellnessSession.findMany({
    where: {
      twitterUsername: {
        in: seedTwitterUsers
      }
    },
    select: {
      twitterUsername: true,
      wellnessFacts: {
        select: {
          id: true
        }
      }
    }
  })

  return wellnessFacts.flatMap((wellnessSession) =>
    wellnessSession.wellnessFacts.map(({ id }) => ({
      twitterUsername: wellnessSession.twitterUsername,
      id
    }))
  )
}
