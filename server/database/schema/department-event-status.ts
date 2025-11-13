import { pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { eventApplication } from './event-application'
import { department } from './department'

export const departmentEventStatus = pgTable(
  'department_event_status',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => eventApplication.id, { onDelete: 'cascade' }),
    departmentId: uuid('department_id')
      .notNull()
      .references(() => department.id, { onDelete: 'cascade' }),
    status: text('status', { enum: ['pending', 'in_review', 'approved'] })
      .notNull()
      .default('pending'),
    note: text('note'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => ({
    eventDepartmentUnique: uniqueIndex('department_event_status_event_department_idx').on(
      table.eventId,
      table.departmentId,
    ),
  }),
)
