import type Stripe from 'stripe'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { isStripeLive } from '@/lib/config'
import { assert } from '@/lib/server-utils'
import { stripe } from '@/lib/stripe'

const relevantStripeEvents = new Set<Stripe.Event.Type>([
  'checkout.session.completed'
])
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'internal config error' },
      { status: 500 }
    )
  }

  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature')
  if (!signature) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
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

          console.log(
            'unlocking user',
            checkoutSession.metadata.twitterUsername
          )

          // await unlockUser({
          //   username: checkoutSession.metadata.username,
          //   unlockType: 'stripe'
          // })

          revalidatePath(`/x/${checkoutSession.metadata.twitterUsername}`)
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
