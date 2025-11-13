import { index, json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { eventApplication } from './event-application'
import { user } from './user'

export const eventAuditLog = pgTable(
  'event_audit_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => eventApplication.id, { onDelete: 'cascade' }),
    actorUserId: uuid('actor_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    action: text('action', {
      enum: ['create', 'update', 'status_change', 'add_document', 'remove_document'],
    }).notNull(),
    payload: json('payload'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => ({
    eventIdIdx: index('event_audit_log_event_id_idx').on(table.eventId),
    actorUserIdIdx: index('event_audit_log_actor_user_id_idx').on(table.actorUserId),
  }),
)
