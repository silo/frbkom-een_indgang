import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { eventApplication } from './event-application'

export const eventSoundInfo = pgTable('event_sound_info', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .unique()
    .references(() => eventApplication.id, { onDelete: 'cascade' }),
  hasSound: boolean('has_sound').notNull().default(false),
  description: text('description'),
  responsibleName: text('responsible_name'),
  responsiblePhone: text('responsible_phone'),
})
