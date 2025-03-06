import { assert } from '@agentic/core'

export * from './config'

export const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
export const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY!
export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
export const stripeProductId = process.env.STRIPE_PRODUCT_ID!

assert(stripeSecretKey, 'STRIPE_SECRET_KEY is required')
assert(stripePublishableKey, 'STRIPE_PUBLISHABLE_KEY is required')
assert(stripeWebhookSecret, 'STRIPE_WEBHOOK_SECRET is required')
assert(stripeProductId, 'STRIPE_PRODUCT_ID is required')

export const isStripeLive = !!stripePublishableKey.startsWith('pk_live_')
export const stripeSuffix = isStripeLive ? 'Live' : 'Test'
