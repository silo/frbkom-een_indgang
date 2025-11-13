import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { eventApplication } from './event-application'
import { eventDocument } from './event-document'

export const eventSafetyInfo = pgTable('event_safety_info', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .unique()
    .references(() => eventApplication.id, { onDelete: 'cascade' }),
  simultaneousPersonsRange: text('simultaneous_persons_range', {
    enum: ['0_50', '51_200', '201_500', '501_1000', '1001_5000', '5001_plus'],
  }).notNull(),
  hasTemporaryConstructions: boolean('has_temporary_constructions').notNull().default(false),
  constructionsDescription: text('constructions_description'),
  constructionsCertificateDocumentId: uuid('constructions_certificate_document_id').references(
    () => eventDocument.id,
    { onDelete: 'set null' },
  ),
  hasReadBR18Bilag11: boolean('has_read_br18_bilag11').notNull().default(false),
  otherConsiderations: text('other_considerations'),
})
