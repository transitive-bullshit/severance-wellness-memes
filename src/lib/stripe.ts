import 'server-only'

import { assert } from '@agentic/core'
import Stripe from 'stripe'

import * as config from './config'
import { getOrUpsertWellnessSession } from './get-or-upsert-wellness-session'
import { stripeProductId } from './server-config'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Stripe secret key not found')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
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

  return session
}
