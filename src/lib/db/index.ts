import type { SetRequired, SimplifyDeep } from 'type-fest'
import { type Prisma, PrismaClient } from '@prisma/client'

import { isStripeLive } from '@/lib/server-config'

import { clone, omit } from '../server-utils'

// This is intentionally left as a global singleton to avoid re-creating the
// Prisma connection instance on successive calls in serverless environments.
let _prisma: ReturnType<typeof createPrismaClient> | undefined

export const prisma = _prisma ?? (_prisma = createPrismaClient())

function createPrismaClient() {
  return new PrismaClient({
    omit: {
      wellnessSession: {
        stripeCustomerEmailLive: true,
        stripeCustomerEmailTest: true
      }
    }
  }).$extends({
    name: 'stripe',
    // query: {
    //   wellnessSession: {
    //     update({ args, query }) {
    //       args = {
    //         include: {
    //           wellnessFacts: true,
    //           pinnedWellnessFact: true,
    //           twitterUser: {
    //             select: { user: true, status: true },
    //           },
    //           ...args.include
    //         },
    //         ...args
    //       }

    //       return query(args)
    //     }
    //   }
    // },
    result: {
      wellnessSession: {
        stripeCustomerId: {
          needs: {
            stripeCustomerIdLive: true,
            stripeCustomerIdTest: true
          },
          compute: (wellnessSession) => {
            return isStripeLive
              ? wellnessSession.stripeCustomerIdLive
              : wellnessSession.stripeCustomerIdTest
          }
        },
        // TODO: we want this for some backend use cases, but never for the frontend
        // stripeCustomerEmail: {
        //   needs: {
        //     stripeCustomerEmailLive: true,
        //     stripeCustomerEmailTest: true
        //   },
        //   compute: (wellnessSession) => {
        //     return isStripeLive
        //       ? wellnessSession.stripeCustomerEmailLive
        //       : wellnessSession.stripeCustomerEmailTest
        //   }
        // },
        stripeCheckoutSessionId: {
          needs: {
            stripeCheckoutSessionIdLive: true,
            stripeCheckoutSessionIdTest: true
          },
          compute: (wellnessSession) => {
            return isStripeLive
              ? wellnessSession.stripeCheckoutSessionIdLive
              : wellnessSession.stripeCheckoutSessionIdTest
          }
        },
        stripeSubscriptionId: {
          needs: {
            stripeSubscriptionIdLive: true,
            stripeSubscriptionIdTest: true
          },
          compute: (wellnessSession) => {
            return isStripeLive
              ? wellnessSession.stripeSubscriptionIdLive
              : wellnessSession.stripeSubscriptionIdTest
          }
        },
        toJSON: {
          needs: {
            id: true
          },
          compute: (wellnessSession) => {
            return (): WellnessSession =>
              clone(
                omit(
                  wellnessSession,
                  'stripeCustomerId',
                  'stripeCustomerIdLive',
                  'stripeCustomerIdTest',
                  'stripeCustomerEmail',
                  'stripeCustomerEmailLive',
                  'stripeCustomerEmailTest',
                  'stripeCheckoutSessionId',
                  'stripeCheckoutSessionIdLive',
                  'stripeCheckoutSessionIdTest',
                  'stripeSubscriptionId',
                  'stripeSubscriptionIdLive',
                  'stripeSubscriptionIdTest'
                )
              ) as WellnessSession
          }
        }
      }
    }
  })
}

export type { TwitterUser, WellnessFact } from '@prisma/client'

type WellnessSessionBase = Prisma.Result<
  typeof prisma.wellnessSession,
  {
    include: {
      wellnessFacts: true
      twitterUser: true
      pinnedWellnessFact: true
    }
  },
  'findUniqueOrThrow'
>

export type WellnessSession = SimplifyDeep<
  Omit<
    WellnessSessionBase,
    | 'twitterUser'
    | 'stripeCustomerEmail'
    | 'stripeCustomerEmailLive'
    | 'stripeCustomerEmailTest'
  > & {
    twitterUser: SetRequired<
      Partial<NonNullable<WellnessSessionBase['twitterUser']>>,
      'user' | 'status'
    > | null
  }
>
