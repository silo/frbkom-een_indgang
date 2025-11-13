import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { eventApplication } from './event-application'
import { user } from './user'

export const eventStatusHistory = pgTable(
  'event_status_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => eventApplication.id, { onDelete: 'cascade' }),
    fromStatus: text('from_status').notNull(),
    toStatus: text('to_status').notNull(),
    changedByUserId: uuid('changed_by_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    changedAt: timestamp('changed_at', { withTimezone: true }).notNull().defaultNow(),
    note: text('note'),
  },
  table => ({
    eventIdIdx: index('event_status_history_event_id_idx').on(table.eventId),
  }),
)
