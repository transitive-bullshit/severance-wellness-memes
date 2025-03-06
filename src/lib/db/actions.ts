'use server'
import 'server-only'

import { pruneNullOrUndefined } from '@agentic/core'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import type * as types from '@/lib/types'
import { prisma } from '@/lib/db'
import { stripeSuffix } from '@/lib/server-config'

import { resolveWellnessSession } from '../resolve-wellness-session'
import { createCheckoutSession } from '../stripe'

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

  const wellnessSession = await resolveWellnessSession({ twitterUsername })

  revalidatePath(`/x/${twitterUsername}`)
  return wellnessSession
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
  if (checkoutSession.url) {
    redirect(checkoutSession.url)
  }
}
