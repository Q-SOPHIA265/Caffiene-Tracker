import { pgTable, serial, text, timestamp, boolean, real, integer, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

/**
 * USERS TABLE
 * Stores user account information
 */
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  displayName: text('display_name').notNull(),
  passwordHash: text('password_hash').notNull(),
  profileImage: text('profile_image').default('/images/default-profile.webp'),
  age: integer('age'),
  bodyWeight: real('body_weight').default(70), // Default 70kg
  emailVerified: boolean('email_verified').default(false),
  role: text('role').default('user'), // 'user' or 'admin'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

/**
 * EMAIL VERIFICATION TOKENS TABLE
 * Stores tokens for email verification
 */
export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull(),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  verified: boolean('verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

/**
 * SESSIONS TABLE
 * Stores user sessions
 */
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActivityAt: timestamp('last_activity_at').defaultNow()
});

/**
 * CAFFEINE CONSUMPTIONS TABLE
 * Stores user caffeine intake logs
 */
export const caffeineConsumptions = pgTable('caffeine_consumptions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(), // mg
  type: text('type').notNull(), // 'coffee', 'caffeine', 'tea', 'energy-drink'
  label: text('label').notNull(),
  concentration: real('concentration'), // mg/L (calculated)
  consumedAt: timestamp('consumed_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

/**
 * RELATIONS
 */
export const usersRelations = relations(users, ({ many }) => ({
  consumptions: many(caffeineConsumptions),
  sessions: many(sessions),
  emailTokens: many(emailVerificationTokens)
}));

export const caffeineConsumptionsRelations = relations(caffeineConsumptions, ({ one }) => ({
  user: one(users, {
    fields: [caffeineConsumptions.userId],
    references: [users.id]
  })
}));
