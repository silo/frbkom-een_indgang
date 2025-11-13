import { z } from 'zod'

export const documentKindEnum = z.enum([
  'attachment',
  'construction_certificate',
  'plan',
  'police_approval',
])

// Maximum 5MB as per runtime config
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export const uploadDocumentSchema = z.object({
  eventId: z.string().uuid(),
  kind: documentKindEnum,
  fileName: z.string().min(1).max(255),
  mimeType: z.literal('application/pdf'),
  sizeBytes: z.number().int().min(1).max(MAX_FILE_SIZE_BYTES, 'File size exceeds 5MB limit'),
  content: z.string().min(1), // Base64 encoded PDF
})

export const listDocumentsSchema = z.object({
  eventId: z.string().uuid(),
})

export const deleteDocumentSchema = z.object({
  id: z.string().uuid(),
})

export const getDocumentSchema = z.object({
  id: z.string().uuid(),
})

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>
export type ListDocumentsInput = z.infer<typeof listDocumentsSchema>
export type DeleteDocumentInput = z.infer<typeof deleteDocumentSchema>
export type GetDocumentInput = z.infer<typeof getDocumentSchema>
export type DocumentKind = z.infer<typeof documentKindEnum>
