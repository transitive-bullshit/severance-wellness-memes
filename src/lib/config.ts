export const isServer = typeof window === 'undefined'
export const isSafari =
  !isServer && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const title = 'Severance Wellness Session'
export const description =
  'Roast your Twitter profile with AI-generated Severance wellness memes.'
export const domain =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ??
  'severance-wellness-session.com'

export const author = 'Travis Fischer'
export const twitter = 'transitive_bs'
export const twitterUrl = `https://x.com/${twitter}`
export const twitterLaunchThreadUrl = 'TODO'
export const numTwitterTweetsProcdessed = 200
export const copyright = `© ${new Date().getFullYear()} Lumon Industries. All rights reserved.`
export const madeWithLove = 'Made with ❤️ in Bangkok'
export const githubUrl =
  'https://github.com/transitive-bullshit/severance-wellness-memes'

export const env =
  process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV ?? 'development'
export const isVercel = !!(
  process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL
)
export const isDev = env === 'development' && !isVercel
export const isProd = env === 'production'
export const isTest = env === 'test'

export const port = process.env.PORT || '3000'
export const prodUrl = `https://${domain}`
export const url = isDev ? `http://localhost:${port}` : prodUrl
export const vercelUrl =
  process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL
export const apiBaseUrl = isDev || !vercelUrl ? url : `https://${vercelUrl}`
export const ogImageUrl = `${prodUrl}/og.jpg`

export const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY!
export const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY!
export const isStripeLive = !!stripePublishableKey.startsWith('pk_live_')
