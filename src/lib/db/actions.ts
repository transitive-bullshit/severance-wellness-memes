'use server'
import 'server-only'

import { pruneNullOrUndefined } from '@agentic/core'
import { waitUntil } from '@vercel/functions'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/db'
import { resolveWellnessSession } from '@/lib/resolve-wellness-session'
import { stripeSuffix } from '@/lib/server-config'
import { assert } from '@/lib/server-utils'
import { createCheckoutSession } from '@/lib/stripe'

import { revalidateWellnessSession } from '../revalidate-wellness-session'

export async function unlockWellnessSession(opts: {
  twitterUsername: string
  stripeCustomerId?: string
  stripeCustomerEmail?: string | null
  stripeCheckoutSessionId?: string
  stripeSubscriptionId?: string
}): Promise<void> {
  const {
    twitterUsername,
    stripeCustomerId,
    stripeCustomerEmail,
    stripeCheckoutSessionId,
    stripeSubscriptionId
  } = opts
  console.log('unlocking user', pruneNullOrUndefined(opts))

  await prisma.wellnessSession.update({
    where: { twitterUsername },
    data: pruneNullOrUndefined({
      status: 'pending',
      [`stripeCustomerId${stripeSuffix}`]: stripeCustomerId,
      [`stripeCustomerEmail${stripeSuffix}`]: stripeCustomerEmail,
      [`stripeCheckoutSessionId${stripeSuffix}`]: stripeCheckoutSessionId,
      [`stripeSubscriptionId${stripeSuffix}`]: stripeSubscriptionId
    })
  })
  await revalidateWellnessSession({ twitterUsername })

  // Asynchronously resolve the wellness session without blocking the HTTP
  // response, so stripe receives the 200 right away and redirects the user to
  // the pending wellness session page.
  waitUntil(
    (async () => {
      await resolveWellnessSession({ twitterUsername })
      await revalidateWellnessSession({ twitterUsername })
    })()
  )
}

export async function initCheckoutSession({
  twitterUsername
}: {
  twitterUsername: string
}) {
  const checkoutSession = await createCheckoutSession({
    twitterUsername
  })

  console.log('checkoutSession', checkoutSession)
  assert(checkoutSession.url, 'stripe checkout session url not found')
  redirect(checkoutSession.url)
}
