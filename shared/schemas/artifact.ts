import { z } from 'zod'

export const artifactKindEnum = z.enum(['stage', 'booth', 'facility', 'other'])

export const createArtifactSchema = z.object({
  eventId: z.string().uuid(),
  kind: artifactKindEnum,
  label: z.string().min(1).max(100),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  width: z.number().int().min(1),
  height: z.number().int().min(1),
  rotation: z.number().int().min(0).max(360).default(0),
})

export const updateArtifactSchema = z.object({
  id: z.string().uuid(),
  kind: artifactKindEnum.optional(),
  label: z.string().min(1).max(100).optional(),
  x: z.number().int().min(0).optional(),
  y: z.number().int().min(0).optional(),
  width: z.number().int().min(1).optional(),
  height: z.number().int().min(1).optional(),
  rotation: z.number().int().min(0).max(360).optional(),
})

export const deleteArtifactSchema = z.object({
  id: z.string().uuid(),
})

export const listArtifactsSchema = z.object({
  eventId: z.string().uuid(),
})

export type CreateArtifactInput = z.infer<typeof createArtifactSchema>
export type UpdateArtifactInput = z.infer<typeof updateArtifactSchema>
export type DeleteArtifactInput = z.infer<typeof deleteArtifactSchema>
export type ListArtifactsInput = z.infer<typeof listArtifactsSchema>
export type ArtifactKind = z.infer<typeof artifactKindEnum>
