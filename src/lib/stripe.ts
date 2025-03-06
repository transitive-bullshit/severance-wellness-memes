import 'server-only'

import Stripe from 'stripe'

import * as config from './config'
import { prisma } from './db'
import { unlockWellnessSession } from './db/actions'
import { getOrUpsertWellnessSession } from './get-or-upsert-wellness-session'
import { stripeProductId, stripeSecretKey, stripeSuffix } from './server-config'
import { assert } from './server-utils'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia'
})

export async function createCheckoutSession({
  twitterUsername
}: {
  twitterUsername: string
}) {
  const wellnessSession = await getOrUpsertWellnessSession({
    twitterUsername
  })
  assert(
    wellnessSession.status !== 'missing',
    `Wellness session not found for ${twitterUsername}`
  )

  const metadata = {
    type: 'severance-wellness-session-twitter-user',
    twitterUsername
  }

  const successUrl = `${config.url}/x/${twitterUsername}/success`
  const cancelUrl = `${config.url}/x/${twitterUsername}/cancel`

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          product: stripeProductId,
          currency: 'USD',
          unit_amount: 800
        },
        quantity: 1
      }
    ],
    payment_intent_data: {
      metadata,
      setup_future_usage: 'off_session'
    },
    metadata,
    success_url: successUrl,
    cancel_url: cancelUrl
  })

  await prisma.wellnessSession.update({
    where: {
      twitterUsername
    },
    data: {
      [`stripeCheckoutSessionId${stripeSuffix}`]: session.id
    }
  })

  return session
}

export async function handleCheckoutSessionCompleted({
  checkoutSession
}: {
  checkoutSession: Stripe.Checkout.Session
}): Promise<void> {
  assert(checkoutSession.metadata, 'unexpected checkout session metadata', {
    status: 400
  })
  assert(
    checkoutSession.metadata.type === 'severance-wellness-session-twitter-user',
    'invalid checkout session metadata',
    { status: 400 }
  )
  assert(
    checkoutSession.metadata.twitterUsername,
    'invalid checkout session metadata',
    { status: 400 }
  )

  await unlockWellnessSession({
    twitterUsername: checkoutSession.metadata.twitterUsername,
    stripeCustomerId:
      typeof checkoutSession.customer === 'string'
        ? checkoutSession.customer
        : checkoutSession.customer?.id,
    stripeCustomerEmail:
      checkoutSession.customer_email ?? checkoutSession.customer_details?.email,
    stripeCheckoutSessionId: checkoutSession.id,
    stripeSubscriptionId:
      typeof checkoutSession.subscription === 'string'
        ? checkoutSession.subscription
        : checkoutSession.subscription?.id
  })
}
