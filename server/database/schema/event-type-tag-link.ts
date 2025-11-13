import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { eventApplication } from './event-application'
import { eventTypeTag } from './event-type-tag'

export const eventTypeTagLink = pgTable(
  'event_type_tag_link',
  {
    eventId: uuid('event_id')
      .notNull()
      .references(() => eventApplication.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => eventTypeTag.id, { onDelete: 'cascade' }),
  },
  table => ({
    pk: primaryKey({ columns: [table.eventId, table.tagId] }),
  }),
)
