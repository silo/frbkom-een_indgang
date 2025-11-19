import { z } from 'zod'

// Enums
export const attendanceRangeEnum = z.enum([
  '0_50',
  '51_200',
  '201_500',
  '501_1000',
  '1001_5000',
  '5001_plus',
])

export const recurringIntervalEnum = z.enum(['daily', 'weekly', 'monthly'])

export const locationTypeEnum = z.enum(['predefined', 'custom'])

export const eventStatusEnum = z.enum(['draft', 'submitted'])

export const reviewStatusEnum = z.enum([
  'unprocessed',
  'in_review',
  'partially_approved',
  'approved',
  'rejected',
])

// Validation helpers
const cprRegex = /^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])\d{2}[-]?\d{4}$/
const cvrRegex = /^(DK)?\d{8}$/
const phoneRegex = /^\d{8}$/

export const cvrCprSchema = z.string().refine((val) => cprRegex.test(val) || cvrRegex.test(val), {
  message: 'Invalid CVR or CPR number',
})

export const phoneSchema = z.string().refine((val) => phoneRegex.test(val.replace(/\s/g, '')), {
  message: 'Invalid phone number',
})

// Contact info schema
export const contactInfoSchema = z.object({
  cvrCpr: cvrCprSchema,
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: phoneSchema,
  email: z.string().email('Invalid email address'),
  isCommercial: z.boolean().nullable(),
  contactPerson: z.object({
    fullName: z.string().min(2, 'Contact person name must be at least 2 characters'),
    phone: phoneSchema,
  }),
})

// Location union schema
export const locationSchema = z.discriminatedUnion('locationType', [
  z.object({
    locationType: z.literal('custom'),
    locationAddress: z.string().min(5, 'Address must be at least 5 characters'),
  }),
  z.object({
    locationType: z.literal('predefined'),
    locationPresetId: z.string().uuid('Invalid location preset ID'),
  }),
])

// Base event application schema
export const eventApplicationBaseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  purpose: z.string().min(10, 'Purpose must be at least 10 characters').max(2000),
  expectedAttendanceRange: attendanceRangeEnum,
  commercial: z.boolean(),
  contactPersonName: z.string().optional(),
  contactPersonPhone: z.string().optional(),
  recurring: z.boolean(),
  recurringInterval: recurringIntervalEnum.nullable().optional(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  setupStartAt: z.coerce.date().nullable().optional(),
  setupEndAt: z.coerce.date().nullable().optional(),
})

// Create event schema with validation
export const createEventSchema = eventApplicationBaseSchema
  .extend({
    locationType: locationTypeEnum,
    locationAddress: z.string().optional(),
    locationPresetId: z.string().uuid().optional(),
    typeTagCodes: z.array(z.string().min(2)).nonempty('At least one event type is required'),
  })
  .refine((data) => data.endAt > data.startAt, {
    message: 'End date must be after start date',
    path: ['endAt'],
  })
  .refine((data) => !data.recurring || data.recurringInterval !== null, {
    message: 'Recurring interval is required when event is recurring',
    path: ['recurringInterval'],
  })
  .refine(
    (data) => {
      if (data.setupStartAt && data.setupEndAt) {
        return data.setupEndAt > data.setupStartAt
      }
      return true
    },
    {
      message: 'Setup end must be after setup start',
      path: ['setupEndAt'],
    }
  )
  .refine(
    (data) => {
      if (data.locationType === 'custom') {
        return !!data.locationAddress && data.locationAddress.length >= 5
      }
      return true
    },
    {
      message: 'Address is required for custom location',
      path: ['locationAddress'],
    }
  )
  .refine(
    (data) => {
      if (data.locationType === 'predefined') {
        return !!data.locationPresetId
      }
      return true
    },
    {
      message: 'Location preset is required for predefined location',
      path: ['locationPresetId'],
    }
  )

// Update event schema (similar to create but with id)
export const updateEventSchema = eventApplicationBaseSchema
  .extend({
    id: z.string().uuid(),
    locationType: locationTypeEnum,
    locationAddress: z.string().optional(),
    locationPresetId: z.string().uuid().optional(),
    typeTagCodes: z.array(z.string().min(2)).nonempty('At least one event type is required'),
  })
  .refine((data) => data.endAt > data.startAt, {
    message: 'End date must be after start date',
    path: ['endAt'],
  })
  .refine((data) => !data.recurring || data.recurringInterval !== null, {
    message: 'Recurring interval is required when event is recurring',
    path: ['recurringInterval'],
  })
  .refine(
    (data) => {
      if (data.locationType === 'custom') {
        return !!data.locationAddress && data.locationAddress.length >= 5
      }
      return true
    },
    {
      message: 'Address is required for custom location',
      path: ['locationAddress'],
    }
  )
  .refine(
    (data) => {
      if (data.locationType === 'predefined') {
        return !!data.locationPresetId
      }
      return true
    },
    {
      message: 'Location preset is required for predefined location',
      path: ['locationPresetId'],
    }
  )

// Event draft save schema (less strict)
export const saveDraftEventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200).optional(),
  purpose: z.string().max(2000).optional(),
  expectedAttendanceRange: attendanceRangeEnum.optional(),
  commercial: z.boolean().optional(),
  contactPersonName: z.string().optional(),
  contactPersonPhone: z.string().optional(),
  recurring: z.boolean().optional(),
  recurringInterval: recurringIntervalEnum.nullable().optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  setupStartAt: z.coerce.date().nullable().optional(),
  setupEndAt: z.coerce.date().nullable().optional(),
  locationType: locationTypeEnum.optional(),
  locationAddress: z.string().optional(),
  locationPresetId: z.string().uuid().optional(),
  typeTagCodes: z.array(z.string()).optional(),
})

// Export types
export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type SaveDraftEventInput = z.infer<typeof saveDraftEventSchema>
export type AttendanceRange = z.infer<typeof attendanceRangeEnum>
export type RecurringInterval = z.infer<typeof recurringIntervalEnum>
export type LocationType = z.infer<typeof locationTypeEnum>
export type EventStatus = z.infer<typeof eventStatusEnum>
export type ReviewStatus = z.infer<typeof reviewStatusEnum>
