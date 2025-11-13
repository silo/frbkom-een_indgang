import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const eventTypeTag = pgTable('event_type_tag', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  nameDa: text('name_da').notNull(),
  nameEn: text('name_en').notNull(),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
