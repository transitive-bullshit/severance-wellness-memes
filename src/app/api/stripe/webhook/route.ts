import type Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { unlockWellnessSession } from '@/lib/db/actions'
import { isStripeLive, stripeWebhookSecret } from '@/lib/server-config'
import { assert } from '@/lib/server-utils'
import { stripe } from '@/lib/stripe'

const relevantStripeEvents = new Set<Stripe.Event.Type>([
  'checkout.session.completed'
])

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature')
  if (!signature) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret)
  } catch (err: any) {
    console.error('stripe webhook error: invalid event;', err.message)

    return NextResponse.json({ error: 'invalid stripe event' }, { status: 400 })
  }

  if (event.livemode !== isStripeLive) {
    // Shouldn't ever get here because the signatures should be different, but
    // it's a useful sanity check just in case.
    return NextResponse.json(
      { error: 'invalid stripe event: mode mismatch' },
      { status: 400 }
    )
  }

  if (relevantStripeEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const checkoutSession = event.data.object
          console.log(`stripe event ${event.type}`, checkoutSession)

          assert(
            checkoutSession.metadata,
            'unexpected checkout session metadata',
            { status: 400 }
          )
          assert(
            checkoutSession.metadata.type ===
              'severance-wellness-session-twitter-user',
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
              checkoutSession.customer_email ??
              checkoutSession.customer_details?.email,
            stripeCheckoutSessionId: checkoutSession.id,
            stripeSubscriptionId:
              typeof checkoutSession.subscription === 'string'
                ? checkoutSession.subscription
                : checkoutSession.subscription?.id
          })
          break

        default:
          throw new Error(`unexpected unhandled event "${event.type}"`)
      }
    } catch (err: any) {
      console.error('error processing stripe webhook', err.message)

      return NextResponse.json(
        { error: 'error processing stripe webhook' },
        { status: err.status || 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}
