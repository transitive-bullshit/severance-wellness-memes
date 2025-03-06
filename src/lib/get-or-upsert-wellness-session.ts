'use server'

import { unstable_cache as cache } from 'next/cache'

import type * as types from './types'
import { createContext } from './create-context'
import { prisma } from './db'
import { clone } from './server-utils'
// import { handleCheckoutSessionCompleted, stripe } from './stripe'
import { tryGetTwitterUserByUsername } from './twitter-utils'

export const getOrUpsertWellnessSession = cache(
  async ({
    twitterUsername
  }: {
    twitterUsername: string
  }): Promise<types.WellnessSession> => {
    const existingWellnessSession = await prisma.wellnessSession.findUnique({
      where: {
        twitterUsername
      },
      include: {
        wellnessFacts: true,
        pinnedWellnessFact: true,
        twitterUser: {
          select: { user: true, status: true }
        }
      }
    })

    if (existingWellnessSession) {
      // if (
      //   existingWellnessSession.status === 'initial' &&
      //   existingWellnessSession.stripeCheckoutSessionId
      // ) {
      //   try {
      //     const checkoutSession = await stripe.checkout.sessions.retrieve(
      //       existingWellnessSession.stripeCheckoutSessionId
      //     )

      //     if (
      //       checkoutSession.status === 'complete' &&
      //       checkoutSession.payment_status === 'paid'
      //     ) {
      //       await handleCheckoutSessionCompleted({ checkoutSession })
      //     }
      //   } catch (err: any) {
      //     console.warn(
      //       'ignoring error handling delayed checkout session completed',
      //       err.message
      //     )
      //   }
      // }

      return clone(existingWellnessSession)
      // return existingWellnessSession
    }

    const ctx = createContext()
    const user = await tryGetTwitterUserByUsername(twitterUsername, ctx, {
      fetchFromTwitter: true
    })
    console.log('twitter user', user)
    const status = user ? 'initial' : 'missing'

    const wellnessSession = await prisma.wellnessSession.create({
      data: {
        twitterUserId: user?.id_str,
        twitterUsername,
        status,
        twitterUser: {
          create: {
            twitterUsername,
            user,
            status
          }
        }
      },
      include: {
        wellnessFacts: true,
        pinnedWellnessFact: true,
        twitterUser: {
          select: { user: true, status: true }
        }
      }
    })

    return clone(wellnessSession)
  }
)
