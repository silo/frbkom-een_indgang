import { z } from 'zod'
import { attendanceRangeEnum, locationTypeEnum } from './event'

// Sound Info
export const soundInfoSchema = z.object({
  eventId: z.string().uuid(),
  hasSound: z.boolean(),
  description: z.string().max(1000).optional().nullable(),
  responsibleName: z.string().max(200).optional().nullable(),
  responsiblePhone: z.string().max(20).optional().nullable(),
})

// Waste Info
export const wasteInfoSchema = z
  .object({
    eventId: z.string().uuid(),
    needsWasteHandling: z.boolean(),
    description: z.string().max(1000).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.needsWasteHandling) {
        return !!data.description
      }
      return true
    },
    {
      message: 'Description is required when waste handling is needed',
      path: ['description'],
    }
  )

// Food Info
export const foodInfoSchema = z
  .object({
    eventId: z.string().uuid(),
    hasFoodOrBeverage: z.boolean(),
    description: z.string().max(1000).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.hasFoodOrBeverage) {
        return !!data.description
      }
      return true
    },
    {
      message: 'Description is required when food or beverage is present',
      path: ['description'],
    }
  )

// Safety Info
export const arrangementPlanTypeEnum = z.enum(['upload', 'planner'])

export const safetyInfoSchema = z
  .object({
    eventId: z.string().uuid(),
    simultaneousPersonsRange: attendanceRangeEnum,
    hasTemporaryConstructions: z.boolean(),
    constructionsDescription: z.string().max(1000).optional().nullable(),
    constructionsCertificateDocumentId: z.string().uuid().optional().nullable(),
    hasReadBR18Bilag11: z.boolean(),
    otherConsiderations: z.string().max(2000).optional().nullable(),
    arrangementPlanType: arrangementPlanTypeEnum.optional().nullable(),
    arrangementPlanDocumentId: z.string().uuid().optional().nullable(),
    locationType: locationTypeEnum.optional(),
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
  .refine(
    (data) => {
      const needsUpload = data.locationType === 'custom' || data.arrangementPlanType === 'upload'
      if (needsUpload) {
        return !!data.arrangementPlanDocumentId
      }
      return true
    },
    {
      message: 'Arrangement plan document is required',
      path: ['arrangementPlanDocumentId'],
    }
  )
  .refine(
    (data) => {
      if (data.locationType !== 'custom' && !data.arrangementPlanType) {
        return false
      }
      return true
    },
    {
      message: 'Arrangement plan type is required',
      path: ['arrangementPlanType'],
    }
  )

// Access Info
export const accessInfoSchema = z
  .object({
    eventId: z.string().uuid(),
    needsBlockage: z.boolean(),
    blockageDescription: z.string().max(1000).optional().nullable(),
    policePermissionApplied: z.boolean(),
    policeApprovalDocumentId: z.string().uuid().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.needsBlockage) {
        return !!data.blockageDescription
      }
      return true
    },
    {
      message: 'Description is required when blockage is needed',
      path: ['blockageDescription'],
    }
  )
  .refine(
    (data) => {
      if (data.policePermissionApplied) {
        return !!data.policeApprovalDocumentId
      }
      return true
    },
    {
      message: 'Police approval document is required',
      path: ['policeApprovalDocumentId'],
    }
  )

export type SoundInfoInput = z.infer<typeof soundInfoSchema>
export type WasteInfoInput = z.infer<typeof wasteInfoSchema>
export type FoodInfoInput = z.infer<typeof foodInfoSchema>
export type SafetyInfoInput = z.infer<typeof safetyInfoSchema>
export type AccessInfoInput = z.infer<typeof accessInfoSchema>
