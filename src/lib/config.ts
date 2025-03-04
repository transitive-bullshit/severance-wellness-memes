import { getEnv } from '@agentic/core'

export const isServer = typeof window === 'undefined'
export const isSafari =
  !isServer && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const title = 'Severance Wellness Session'
export const description =
  'Roast your Twitter profile with AI-generated Severance wellness memes.'
export const domain =
  getEnv('NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL') ?? 'severance.vercel.app'

export const author = 'Travis Fischer'
export const twitter = 'transitive_bs'
export const twitterUrl = `https://x.com/${twitter}`
export const copyright = `© ${new Date().getFullYear()} Lumon Industries. All rights reserved.`
export const madeWithLove = 'Made with ❤️ in Bangkok'
export const githubUrl =
  'https://github.com/transitive-bullshit/severance-wellness-memes'

export const env =
  getEnv('NEXT_PUBLIC_VERCEL_ENV') ?? getEnv('NODE_ENV') ?? 'development'
export const isVercel = !!getEnv('NEXT_PUBLIC_VERCEL_ENV')
export const isDev = env === 'development' && !isVercel
export const isTest = env === 'test'

export const port = getEnv('PORT') || '3000'
export const prodUrl = `https://${domain}`
export const url = isDev ? `http://localhost:${port}` : prodUrl

export const apiBaseUrl =
  isDev || !getEnv('NEXT_PUBLIC_VERCEL_URL')
    ? url
    : `https://${getEnv('NEXT_PUBLIC_VERCEL_URL')}`

console.log({
  env,
  isDev,
  isVercel,
  isTest,
  prodUrl,
  url,
  apiBaseUrl,
  vercelUrl: getEnv('NEXT_PUBLIC_VERCEL_URL')
})
