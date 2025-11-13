import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { eventApplication } from './event-application'

export const eventFoodInfo = pgTable('event_food_info', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .unique()
    .references(() => eventApplication.id, { onDelete: 'cascade' }),
  hasFoodOrBeverage: boolean('has_food_or_beverage').notNull().default(false),
  description: text('description'),
})
