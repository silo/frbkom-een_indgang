import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { eventApplication } from './event-application'

export const eventDocument = pgTable(
  'event_document',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => eventApplication.id, { onDelete: 'cascade' }),
    kind: text('kind', {
      enum: ['attachment', 'construction_certificate', 'plan', 'police_approval'],
    }).notNull(),
    fileName: text('file_name').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    content: text('content').notNull(), // Base64 encoded PDF content
    uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => ({
    eventIdKindIdx: index('event_document_event_id_kind_idx').on(table.eventId, table.kind),
  }),
)
