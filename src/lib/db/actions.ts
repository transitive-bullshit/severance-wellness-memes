'use server'
import 'server-only'

import { pruneNullOrUndefined } from '@agentic/core'
import { waitUntil } from '@vercel/functions'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import type * as types from '@/lib/types'
import { prisma } from '@/lib/db'
import { resolveWellnessSession } from '@/lib/resolve-wellness-session'
import { stripeSuffix } from '@/lib/server-config'
import { assert, clone } from '@/lib/server-utils'
import { createCheckoutSession } from '@/lib/stripe'

export async function unlockWellnessSession(opts: {
  twitterUsername: string
  stripeCustomerId?: string
  stripeCustomerEmail?: string | null
  stripeCheckoutSessionId?: string
  stripeSubscriptionId?: string
}): Promise<Partial<types.WellnessSession> | null> {
  const {
    twitterUsername,
    stripeCustomerId,
    stripeCustomerEmail,
    stripeCheckoutSessionId,
    stripeSubscriptionId
  } = opts
  console.log('unlocking user', pruneNullOrUndefined(opts))

  const wellnessSession = await prisma.wellnessSession.update({
    where: { twitterUsername },
    data: pruneNullOrUndefined({
      status: 'pending',
      [`stripeCustomerId${stripeSuffix}`]: stripeCustomerId,
      [`stripeCustomerEmail${stripeSuffix}`]: stripeCustomerEmail,
      [`stripeCheckoutSessionId${stripeSuffix}`]: stripeCheckoutSessionId,
      [`stripeSubscriptionId${stripeSuffix}`]: stripeSubscriptionId
    })
  })
  revalidatePath(`/x/${twitterUsername}`)

  waitUntil(
    (async () => {
      await resolveWellnessSession({ twitterUsername })

      revalidatePath(`/x/${twitterUsername}`)
    })()
  )

  return clone(wellnessSession)
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
