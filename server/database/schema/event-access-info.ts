import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { eventApplication } from './event-application'
import { eventDocument } from './event-document'

export const eventAccessInfo = pgTable('event_access_info', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .unique()
    .references(() => eventApplication.id, { onDelete: 'cascade' }),
  needsBlockage: boolean('needs_blockage').notNull().default(false),
  blockageDescription: text('blockage_description'),
  policePermissionApplied: boolean('police_permission_applied').notNull().default(false),
  policeApprovalDocumentId: uuid('police_approval_document_id').references(
    () => eventDocument.id,
    { onDelete: 'set null' },
  ),
})
