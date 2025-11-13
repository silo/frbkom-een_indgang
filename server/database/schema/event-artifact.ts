import { index, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { eventApplication } from './event-application'

export const eventArtifact = pgTable(
  'event_artifact',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => eventApplication.id, { onDelete: 'cascade' }),
    kind: text('kind', { enum: ['stage', 'booth', 'facility', 'other'] }).notNull(),
    label: text('label').notNull(),
    x: integer('x').notNull(),
    y: integer('y').notNull(),
    width: integer('width').notNull(),
    height: integer('height').notNull(),
    rotation: integer('rotation').notNull().default(0),
  },
  table => ({
    eventIdIdx: index('event_artifact_event_id_idx').on(table.eventId),
  }),
)
