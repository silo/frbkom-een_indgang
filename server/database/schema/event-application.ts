import { boolean, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { user } from './user'
import { locationPreset } from './location-preset'

export const eventApplication = pgTable(
  'event_application',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerUserId: uuid('owner_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    purpose: text('purpose').notNull(),
    expectedAttendanceRange: text('expected_attendance_range', {
      enum: ['0_50', '51_200', '201_500', '501_1000', '1001_5000', '5001_plus'],
    }).notNull(),
    commercial: boolean('commercial').notNull().default(false),
    recurring: boolean('recurring').notNull().default(false),
    recurringInterval: text('recurring_interval', { enum: ['daily', 'weekly', 'monthly'] }),
    startAt: timestamp('start_at', { withTimezone: true }).notNull(),
    endAt: timestamp('end_at', { withTimezone: true }).notNull(),
    setupStartAt: timestamp('setup_start_at', { withTimezone: true }),
    setupEndAt: timestamp('setup_end_at', { withTimezone: true }),
    locationType: text('location_type', { enum: ['predefined', 'custom'] }).notNull(),
    locationAddress: text('location_address'),
    locationPresetId: uuid('location_preset_id').references(() => locationPreset.id, {
      onDelete: 'set null',
    }),
    status: text('status', { enum: ['draft', 'submitted'] }).notNull().default('draft'),
    reviewStatus: text('review_status', {
      enum: ['unprocessed', 'in_review', 'partially_approved', 'approved', 'rejected'],
    })
      .notNull()
      .default('unprocessed'),
    summaryCompletionPct: integer('summary_completion_pct').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => ({
    ownerUserIdStatusIdx: index('event_application_owner_user_id_status_idx').on(
      table.ownerUserId,
      table.status,
    ),
    startAtIdx: index('event_application_start_at_idx').on(table.startAt),
    locationPresetIdIdx: index('event_application_location_preset_id_idx').on(
      table.locationPresetId,
    ),
  }),
)
