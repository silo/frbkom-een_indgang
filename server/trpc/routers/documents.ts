import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { router, protectedProcedure } from '../context'
import {
  uploadDocumentSchema,
  listDocumentsSchema,
  deleteDocumentSchema,
  getDocumentSchema,
} from '../../../shared/schemas/document'
import { eventDocument, eventApplication, eventAuditLog } from '../../database/schema'

export const documentsRouter = router({
  // Upload document
  upload: protectedProcedure.input(uploadDocumentSchema).mutation(async ({ ctx, input }) => {
    // Verify access to event
    const event = await ctx.db.query.eventApplication.findFirst({
      where: eq(eventApplication.id, input.eventId),
    })

    if (!event) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
    }

    const canAdminister = event.ownerUserId === ctx.user.id || ctx.user.role === 'admin'

    if (!canAdminister) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized to upload documents for this event',
      })
    }

    const [document] = await ctx.db.insert(eventDocument).values(input).returning()

    await ctx.db.insert(eventAuditLog).values({
      eventId: input.eventId,
      actorUserId: ctx.user.id,
      action: 'add_document',
      payload: {
        documentId: document.id,
        fileName: document.fileName,
        kind: document.kind,
      },
    })

    return document
  }),

  // List documents for an event
  list: protectedProcedure.input(listDocumentsSchema).query(async ({ ctx, input }) => {
    // Verify access to event
    const event = await ctx.db.query.eventApplication.findFirst({
      where: eq(eventApplication.id, input.eventId),
    })

    if (!event) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
    }

    if (event.ownerUserId !== ctx.user.id && ctx.user.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' })
    }

    const documents = await ctx.db.query.eventDocument.findMany({
      where: eq(eventDocument.eventId, input.eventId),
      columns: {
        id: true,
        eventId: true,
        kind: true,
        fileName: true,
        mimeType: true,
        sizeBytes: true,
        uploadedAt: true,
        // Don't return content in list view
      },
    })

    return documents
  }),

  // Get document by ID (with content)
  get: protectedProcedure.input(getDocumentSchema).query(async ({ ctx, input }) => {
    const document = await ctx.db.query.eventDocument.findFirst({
      where: eq(eventDocument.id, input.id),
    })

    if (!document) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' })
    }

    // Verify access through event
    const event = await ctx.db.query.eventApplication.findFirst({
      where: eq(eventApplication.id, document.eventId),
    })

    if (!event || (event.ownerUserId !== ctx.user.id && ctx.user.role !== 'admin')) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' })
    }

    return document
  }),

  // Delete document
  delete: protectedProcedure.input(deleteDocumentSchema).mutation(async ({ ctx, input }) => {
    const document = await ctx.db.query.eventDocument.findFirst({
      where: eq(eventDocument.id, input.id),
    })

    if (!document) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' })
    }

    // Check ownership
    const event = await ctx.db.query.eventApplication.findFirst({
      where: eq(eventApplication.id, document.eventId),
    })

    if (!event || (event.ownerUserId !== ctx.user.id && ctx.user.role !== 'admin')) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' })
    }

    await ctx.db.delete(eventDocument).where(eq(eventDocument.id, input.id))

    await ctx.db.insert(eventAuditLog).values({
      eventId: document.eventId,
      actorUserId: ctx.user.id,
      action: 'remove_document',
      payload: {
        documentId: document.id,
        fileName: document.fileName,
        kind: document.kind,
      },
    })

    return { success: true }
  }),
})
