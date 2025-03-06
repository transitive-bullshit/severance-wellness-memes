import 'server-only'

import { pruneNullOrUndefined } from '@agentic/core'
import { revalidatePath } from 'next/cache'

import type * as types from '@/lib/types'
import { stripeSuffix } from '@/lib/config'
import { prisma } from '@/lib/db'

export async function unlockWellnessSession({
  twitterUsername,
  stripeCustomerId,
  stripeCustomerEmail,
  stripeCheckoutSessionId,
  stripeSubscriptionId
}: {
  twitterUsername: string
  stripeCustomerId?: string
  stripeCustomerEmail?: string | null
  stripeCheckoutSessionId?: string
  stripeSubscriptionId?: string
}): Promise<Partial<types.WellnessSession> | null> {
  console.log(
    'unlocking user',
    pruneNullOrUndefined({
      twitterUsername,
      stripeCustomerId,
      stripeCustomerEmail,
      stripeCheckoutSessionId,
      stripeSubscriptionId
    })
  )

  const wellnessSession = await prisma.wellnessSession.update({
    where: { twitterUsername },
    data: pruneNullOrUndefined({
      isUnlocked: true,
      [`stripeCustomerId${stripeSuffix}`]: stripeCustomerId,
      [`stripeCustomerEmail${stripeSuffix}`]: stripeCustomerEmail,
      [`stripeCheckoutSessionId${stripeSuffix}`]: stripeCheckoutSessionId,
      [`stripeSubscriptionId${stripeSuffix}`]: stripeSubscriptionId
    })
  })

  revalidatePath(`/x/${twitterUsername}`)
  return wellnessSession
}
