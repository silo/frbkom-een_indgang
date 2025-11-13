import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { router, protectedProcedure } from '../context'
import {
  createArtifactSchema,
  updateArtifactSchema,
  deleteArtifactSchema,
  listArtifactsSchema,
} from '../../../shared/schemas/artifact'
import { eventArtifact, eventApplication } from '../../database/schema'

export const artifactsRouter = router({
  // List artifacts for an event
  list: protectedProcedure.input(listArtifactsSchema).query(async ({ ctx, input }) => {
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

    const artifacts = await ctx.db.query.eventArtifact.findMany({
      where: eq(eventArtifact.eventId, input.eventId),
    })

    return artifacts
  }),

  // Create artifact
  create: protectedProcedure.input(createArtifactSchema).mutation(async ({ ctx, input }) => {
    // Verify access to event
    const event = await ctx.db.query.eventApplication.findFirst({
      where: eq(eventApplication.id, input.eventId),
    })

    if (!event) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
    }

    if (event.ownerUserId !== ctx.user.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized to add artifacts to this event',
      })
    }

    const [artifact] = await ctx.db.insert(eventArtifact).values(input).returning()

    return artifact
  }),

  // Update artifact
  update: protectedProcedure.input(updateArtifactSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updates } = input

    const existing = await ctx.db.query.eventArtifact.findFirst({
      where: eq(eventArtifact.id, id),
      with: { event: true },
    })

    if (!existing) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Artifact not found' })
    }

    // Check ownership through event
    const event = await ctx.db.query.eventApplication.findFirst({
      where: eq(eventApplication.id, existing.eventId),
    })

    if (!event || event.ownerUserId !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' })
    }

    const [updated] = await ctx.db
      .update(eventArtifact)
      .set(updates)
      .where(eq(eventArtifact.id, id))
      .returning()

    return updated
  }),

  // Delete artifact
  delete: protectedProcedure.input(deleteArtifactSchema).mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.query.eventArtifact.findFirst({
      where: eq(eventArtifact.id, input.id),
    })

    if (!existing) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Artifact not found' })
    }

    // Check ownership
    const event = await ctx.db.query.eventApplication.findFirst({
      where: eq(eventApplication.id, existing.eventId),
    })

    if (!event || event.ownerUserId !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' })
    }

    await ctx.db.delete(eventArtifact).where(eq(eventArtifact.id, input.id))

    return { success: true }
  }),
})
