import { z } from 'zod'
import { attendanceRangeEnum } from './event'

// Sound Info
export const soundInfoSchema = z.object({
  eventId: z.string().uuid(),
  hasSound: z.boolean(),
  description: z.string().max(1000).optional().nullable(),
  responsibleName: z.string().max(200).optional().nullable(),
  responsiblePhone: z.string().max(20).optional().nullable(),
})

// Waste Info
export const wasteInfoSchema = z.object({
  eventId: z.string().uuid(),
  needsWasteHandling: z.boolean(),
  description: z.string().max(1000).optional().nullable(),
})

// Food Info
export const foodInfoSchema = z.object({
  eventId: z.string().uuid(),
  hasFoodOrBeverage: z.boolean(),
  description: z.string().max(1000).optional().nullable(),
})

// Safety Info
export const safetyInfoSchema = z
  .object({
    eventId: z.string().uuid(),
    simultaneousPersonsRange: attendanceRangeEnum,
    hasTemporaryConstructions: z.boolean(),
    constructionsDescription: z.string().max(1000).optional().nullable(),
    constructionsCertificateDocumentId: z.string().uuid().optional().nullable(),
    hasReadBR18Bilag11: z.boolean(),
    otherConsiderations: z.string().max(2000).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.hasTemporaryConstructions) {
        return !!data.constructionsDescription && data.constructionsCertificateDocumentId !== null
      }
      return true
    },
    {
      message:
        'Description and certificate are required when temporary constructions are present',
      path: ['constructionsDescription'],
    }
  )

// Access Info
export const accessInfoSchema = z.object({
  eventId: z.string().uuid(),
  needsBlockage: z.boolean(),
  blockageDescription: z.string().max(1000).optional().nullable(),
  policePermissionApplied: z.boolean(),
  policeApprovalDocumentId: z.string().uuid().optional().nullable(),
})

export type SoundInfoInput = z.infer<typeof soundInfoSchema>
export type WasteInfoInput = z.infer<typeof wasteInfoSchema>
export type FoodInfoInput = z.infer<typeof foodInfoSchema>
export type SafetyInfoInput = z.infer<typeof safetyInfoSchema>
export type AccessInfoInput = z.infer<typeof accessInfoSchema>
