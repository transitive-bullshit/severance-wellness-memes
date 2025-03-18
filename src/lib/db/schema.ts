import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique()
})

export const resolvedStatusEnum = pgEnum('ResolvedStatus', [
  'initial',
  'pending',
  'resolved',
  'error',
  'missing'
])

export const wellnessSessionTable = pgTable('WellnessSession', {
  id: text('id').primaryKey().default('cuid()'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),

  twitterUsername: text('twitterUsername').notNull().unique(),
  twitterUserId: text('twitterUserId').unique(),
  userFullName: text('userFullName'),
  status: resolvedStatusEnum('status').default('initial').notNull(),

  pinnedWellnessFactId: text('pinnedWellnessFactId'),

  stripeCustomerIdLive: text('stripeCustomerIdLive'),
  stripeCustomerIdTest: text('stripeCustomerIdTest'),
  stripeCustomerEmailLive: text('stripeCustomerEmailLive'),
  stripeCustomerEmailTest: text('stripeCustomerEmailTest'),
  stripeCheckoutSessionIdLive: text('stripeCheckoutSessionIdLive'),
  stripeCheckoutSessionIdTest: text('stripeCheckoutSessionIdTest'),
  stripeSubscriptionIdLive: text('stripeSubscriptionIdLive'),
  stripeSubscriptionIdTest: text('stripeSubscriptionIdTest')
})

export const twitterUserTable = pgTable('TwitterUser', {
  id: text('id').primaryKey(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),

  twitterUsername: text('twitterUsername').notNull().unique(),
  status: resolvedStatusEnum('status').default('initial').notNull(),

  user: jsonb('user'),
  timelineTweetIds: text('timelineTweetIds').array(),
  tweets: jsonb('tweets').default('{}').notNull(),
  users: jsonb('users').default('{}').notNull()
})

export const wellnessFactTable = pgTable('WellnessFact', {
  id: text('id').primaryKey().default('cuid()'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),

  text: text('text').notNull(),
  model: text('model').notNull(),

  twitterUserId: text('twitterUserId').notNull(),
  twitterUsername: text('twitterUsername').notNull(),
  tags: text('tags').array()
})

// Defining relations
// Note: Relations in Drizzle are defined separately using the relations function
// These would typically be defined in separate relation files or in the same file below table definitions
