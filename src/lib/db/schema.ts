import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import {
  customType,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core'

import type * as types from '@/lib/types'

const citext = customType<{ data: string }>({
  dataType() {
    return 'citext'
  }
})

export const resolvedStatusEnum = pgEnum('ResolvedStatus', [
  'initial',
  'pending',
  'resolved',
  'error',
  'missing'
])

export const wellnessSessionTable = pgTable(
  'WellnessSession',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).default(
      sql`CURRENT_TIMESTAMP`
    ),

    twitterUsername: citext('twitterUsername').notNull().unique(),
    twitterUserId: text('twitterUserId').unique(),
    userFullName: text('userFullName'),
    status: resolvedStatusEnum('status').default('initial').notNull(),

    pinnedWellnessFactId: text('pinnedWellnessFactId'),
    // .references((): AnyPgColumn => wellnessFactTable.id),

    stripeCustomerIdLive: text('stripeCustomerIdLive'),
    stripeCustomerIdTest: text('stripeCustomerIdTest'),
    stripeCustomerEmailLive: text('stripeCustomerEmailLive'),
    stripeCustomerEmailTest: text('stripeCustomerEmailTest'),
    stripeCheckoutSessionIdLive: text('stripeCheckoutSessionIdLive'),
    stripeCheckoutSessionIdTest: text('stripeCheckoutSessionIdTest'),
    stripeSubscriptionIdLive: text('stripeSubscriptionIdLive'),
    stripeSubscriptionIdTest: text('stripeSubscriptionIdTest')
  },
  (table) => [
    index('wellnessSession_twitterUsername_idx').on(table.twitterUsername),
    uniqueIndex('wellnessSession_twitterUserId_idx').on(table.twitterUserId),
    index('wellnessSession_createdAt_idx').on(table.createdAt),
    index('wellnessSession_updatedAt_idx').on(table.updatedAt)
  ]
)

export const wellnessSessionRelations = relations(
  wellnessSessionTable,
  ({ one, many }) => ({
    pinnedWellnessFact: one(wellnessFactTable, {
      fields: [wellnessSessionTable.pinnedWellnessFactId],
      references: [wellnessFactTable.id]
    }),

    twitterUser: one(twitterUserTable, {
      fields: [wellnessSessionTable.twitterUserId],
      references: [twitterUserTable.id]
    }),

    wellnessFacts: many(wellnessFactTable)
  })
)

export const twitterUserTable = pgTable(
  'TwitterUser',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    // .references(() => wellnessSessionTable.twitterUserId, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).default(
      sql`CURRENT_TIMESTAMP`
    ),

    twitterUsername: citext('twitterUsername').notNull().unique(),
    status: resolvedStatusEnum('status').default('initial').notNull(),

    user: jsonb('user').$type<types.SocialDataTwitterUser>(),
    timelineTweetIds: text('timelineTweetIds').array(),
    tweets: jsonb('tweets')
      .$type<Record<string, types.Tweet>>()
      .default({})
      .notNull(),
    users: jsonb('users')
      .$type<Record<string, types.SocialDataTwitterUser>>()
      .default({})
      .notNull()
  },
  (table) => [
    index('twitterUser_twitterUsername_idx').on(table.twitterUsername),
    index('twitterUser_status_idx').on(table.status),
    index('twitterUser_createdAt_idx').on(table.createdAt),
    index('twitterUser_updatedAt_idx').on(table.updatedAt)
  ]
)

export const twitterUserRelations = relations(twitterUserTable, ({ one }) => ({
  wellnessSession: one(wellnessSessionTable, {
    fields: [twitterUserTable.id],
    references: [wellnessSessionTable.twitterUserId]
  })
}))

export const wellnessFactTable = pgTable(
  'WellnessFact',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).default(
      sql`CURRENT_TIMESTAMP`
    ),

    text: text('text').notNull(),
    model: text('model').notNull(),

    twitterUserId: text('twitterUserId').notNull(),
    twitterUsername: citext('twitterUsername').notNull(),
    tags: text('tags').array()
  },
  (table) => [
    index('wellnessFact_twitterUsername_idx').on(table.twitterUsername),
    index('wellnessFact_twitterUserId_idx').on(table.twitterUserId),
    index('wellnessFact_tags_idx').on(table.tags),
    index('wellnessFact_createdAt_idx').on(table.createdAt),
    index('wellnessFact_updatedAt_idx').on(table.updatedAt)
  ]
)

export const wellnessFactRelations = relations(
  wellnessFactTable,
  ({ one, many }) => ({
    wellnessSession: one(wellnessSessionTable, {
      fields: [wellnessFactTable.twitterUserId],
      references: [wellnessSessionTable.twitterUserId]
    }),

    pinnedWellnessSessions: many(wellnessSessionTable)
  })
)
