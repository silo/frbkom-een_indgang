import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  identityType: text('identity_type', { enum: ['private', 'professional'] }).notNull(),
  cpr: text('cpr').notNull(),
  mitidUuid: text('mitid_uuid').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  role: text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
  companyCvr: text('company_cvr'),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  lastIdp: text('last_idp'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
