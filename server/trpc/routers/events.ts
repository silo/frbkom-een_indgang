import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { router, protectedProcedure } from '../context'
import {
  createEventSchema,
  updateEventSchema,
  saveDraftEventSchema,
} from '../../../shared/schemas/event'
import { eventApplication } from '../../database/schema'
import { z } from 'zod'

export const eventsRouter = router({
  // Create a new event
  create: protectedProcedure.input(createEventSchema).mutation(async ({ ctx, input }) => {
    const { locationType, locationAddress, locationPresetId, ...eventData } = input

    // Create event application
    const [event] = await ctx.db
      .insert(eventApplication)
      .values({
        ...eventData,
        ownerUserId: ctx.user.id,
        locationType,
        locationAddress: locationType === 'custom' ? locationAddress : null,
        locationPresetId: locationType === 'predefined' ? locationPresetId : null,
        status: 'draft',
        reviewStatus: 'unprocessed',
        summaryCompletionPct: 0,
      })
      .returning()

    // Link event type tags
    // TODO Phase 2: Get tag IDs from codes and link with eventTypeTagLink
    // if (typeTagCodes && typeTagCodes.length > 0) {
    //   await ctx.db.insert(eventTypeTagLink).values(...)
    // }

    return event
  }),

  // Update an existing event
  update: protectedProcedure.input(updateEventSchema).mutation(async ({ ctx, input }) => {
    const { id, locationType, locationAddress, locationPresetId, ...eventData } = input

    // Check ownership
    const existing = await ctx.db.query.eventApplication.findFirst({
      where: eq(eventApplication.id, id),
    })

    if (!existing) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
    }

    if (existing.ownerUserId !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to update this event' })
    }

    // Update event
    const [updated] = await ctx.db
      .update(eventApplication)
      .set({
        ...eventData,
        locationType,
        locationAddress: locationType === 'custom' ? locationAddress : null,
        locationPresetId: locationType === 'predefined' ? locationPresetId : null,
        updatedAt: new Date(),
      })
      .where(eq(eventApplication.id, id))
      .returning()

    return updated
  }),

  // Save draft (partial update)
  saveDraft: protectedProcedure.input(saveDraftEventSchema).mutation(async ({ ctx, input }) => {
    const { id, ...draftData } = input

    if (!id) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Event ID is required' })
    }

    // Check ownership
    const existing = await ctx.db.query.eventApplication.findFirst({
      where: eq(eventApplication.id, id),
    })

    if (!existing) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
    }

    if (existing.ownerUserId !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to update this event' })
    }

    // Update with partial data
    const [updated] = await ctx.db
      .update(eventApplication)
      .set({
        ...draftData,
        updatedAt: new Date(),
      })
      .where(eq(eventApplication.id, id))
      .returning()

    return updated
  }),

  // Submit event for review
  submit: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.eventApplication.findFirst({
        where: eq(eventApplication.id, input.id),
      })

      if (!existing) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      }

      if (existing.ownerUserId !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to submit this event' })
      }

      if (existing.status === 'submitted') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Event already submitted' })
      }

      // Update status
      const [updated] = await ctx.db
        .update(eventApplication)
        .set({
          status: 'submitted',
          updatedAt: new Date(),
        })
        .where(eq(eventApplication.id, input.id))
        .returning()

      return updated
    }),

  // Get event by ID
  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.query.eventApplication.findFirst({
        where: eq(eventApplication.id, input.id),
      })

      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      }

      // Check access
      if (event.ownerUserId !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to view this event' })
      }

      return event
    }),

  // List user's own events
  listMine: protectedProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.query.eventApplication.findMany({
      where: eq(eventApplication.ownerUserId, ctx.user.id),
      orderBy: (events, { desc }) => [desc(events.createdAt)],
    })

    return events
  }),
})
