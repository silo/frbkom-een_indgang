import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { eventApplication } from './event-application'

export const eventWasteInfo = pgTable('event_waste_info', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .unique()
    .references(() => eventApplication.id, { onDelete: 'cascade' }),
  needsWasteHandling: boolean('needs_waste_handling').notNull().default(false),
  description: text('description'),
})
