import 'server-only'

import Stripe from 'stripe'

import * as config from './config'
import { prisma } from './db'
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

  // TODO: these urls don't exist yet
  const successUrl = `${config.url}/x/${twitterUsername}?checkout=success`
  const cancelUrl = `${config.url}/x/${twitterUsername}?checkout=cancelled`

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
