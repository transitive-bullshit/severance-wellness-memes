import type { SetRequired, SimplifyDeep } from 'type-fest'
import { type Prisma, PrismaClient } from '@prisma/client'

// This is intentionally left as a global singleton to avoid re-creating the
// Prisma connection instance on successive calls in serverless environments.
let _prisma: PrismaClient | undefined

export const prisma = _prisma ?? (_prisma = new PrismaClient())

export type { WellnessFact } from '@prisma/client'

type WellnessSessionBase = Prisma.WellnessSessionGetPayload<{
  include: { wellnessFacts: true; twitterUser: true }
}>

export type WellnessSession = SimplifyDeep<
  Omit<WellnessSessionBase, 'twitterUser'> & {
    twitterUser: SetRequired<
      Partial<NonNullable<WellnessSessionBase['twitterUser']>>,
      'user'
    > | null
  }
>
