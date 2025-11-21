import { TRPCError } from '@trpc/server'
import { eq, desc } from 'drizzle-orm'
import { router, adminProcedure } from '../context'
import { z } from 'zod'
import { reviewStatusEnum } from '../../../shared/schemas/event'
import {
  updateDepartmentStatusSchema,
  listDepartmentStatusesSchema,
} from '../../../shared/schemas/department-status'
import { eventApplication, departmentEventStatus, eventAuditLog, department } from '../../database/schema'
import {
  CORE_DEPARTMENT_SLUGS,
  type CoreDepartmentSlug,
  ensureDefaultDepartmentStatus,
  sortCoreDepartments,
} from '../../utils/department-defaults'
import { sendRejectionEmail } from '../../utils/email'

export const adminRouter = router({
  // List all events
  listAll: adminProcedure
    .input(
      z
        .object({
          status: z.enum(['draft', 'submitted']).optional(),
          reviewStatus: reviewStatusEnum.optional(),
          search: z.string().trim().max(200).optional(),
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { limit = 50, offset = 0, status, reviewStatus, search } = input || {}
      const normalizedSearch = search?.trim()

      const events = await ctx.db.query.eventApplication.findMany({
        where: (events, { and, eq, ilike, or }) => {
          const conditions = []
          if (status) conditions.push(eq(events.status, status))
          if (reviewStatus) conditions.push(eq(events.reviewStatus, reviewStatus))
          if (normalizedSearch) {
            const pattern = `%${normalizedSearch}%`
            conditions.push(or(ilike(events.title, pattern), ilike(events.purpose, pattern)))
          }
          return conditions.length > 0 ? and(...conditions) : undefined
        },
        limit,
        offset,
        orderBy: (events, { desc }) => [desc(events.createdAt)],
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              email: true,
              phone: true,
              // Don't expose CPR
            },
          },
        },
      })

      return events
    }),

  // Get event by ID (admin view with full details)
  byId: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.query.eventApplication.findFirst({
        where: eq(eventApplication.id, input.id),
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              email: true,
              phone: true,
              companyCvr: true,
              // Don't expose CPR even in admin
            },
          },
        },
      })

      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      }

      return event
    }),

  // Update event review status
  updateReviewStatus: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        reviewStatus: reviewStatusEnum,
        note: z.string().max(2000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const trimmedNote = input.note?.trim()

      if (input.reviewStatus === 'rejected' && !trimmedNote) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'A rejection note is required when rejecting an event',
        })
      }

      const event = await ctx.db.query.eventApplication.findFirst({
        where: eq(eventApplication.id, input.id),
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      }

      if (input.reviewStatus === 'approved') {
        const departmentStatuses = await ctx.db
          .select({ status: departmentEventStatus.status })
          .from(departmentEventStatus)
          .where(eq(departmentEventStatus.eventId, input.id))

        if (
          !departmentStatuses.length ||
          departmentStatuses.some((entry) => entry.status !== 'approved')
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'All departments must approve before setting the case to approved',
          })
        }
      }

      if (input.reviewStatus === 'rejected' && !event.owner?.email) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Applicant email is missing for this event',
        })
      }

      try {
        const updated = await ctx.db.transaction(async (tx) => {
          const [next] = await tx
            .update(eventApplication)
            .set({
              reviewStatus: input.reviewStatus,
              updatedAt: new Date(),
            })
            .where(eq(eventApplication.id, input.id))
            .returning()

          await tx.insert(eventAuditLog).values({
            eventId: input.id,
            actorUserId: ctx.user.id,
            action: 'status_change',
            payload: {
              fromStatus: event.reviewStatus,
              toStatus: input.reviewStatus,
              note: trimmedNote,
            },
          })

          if (input.reviewStatus === 'rejected') {
            await sendRejectionEmail({
              to: event.owner!.email!,
              applicantName: event.owner?.name,
              eventTitle: event.title,
              rejectionNote: trimmedNote!,
            })
          }

          return next
        })

        return updated
      } catch (error) {
        console.error('Failed to update review status', error)
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update review status',
        })
      }
    }),

  // Set department status
  setDepartmentStatus: adminProcedure
    .input(updateDepartmentStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const [targetDepartment] = await ctx.db
        .select()
        .from(department)
        .where(eq(department.id, input.departmentId))
        .limit(1)

      if (
        !targetDepartment ||
        !targetDepartment.active ||
        !CORE_DEPARTMENT_SLUGS.includes(targetDepartment.slug as CoreDepartmentSlug)
      ) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Department is not available' })
      }

      // Upsert department status
      const [status] = await ctx.db
        .insert(departmentEventStatus)
        .values({
          eventId: input.eventId,
          departmentId: targetDepartment.id,
          status: input.status,
          note: input.note,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [departmentEventStatus.eventId, departmentEventStatus.departmentId],
          set: {
            status: input.status,
            note: input.note,
            updatedAt: new Date(),
          },
        })
        .returning()

      return status
    }),

  // List department statuses for an event
  listDepartmentStatuses: adminProcedure
    .input(listDepartmentStatusesSchema)
    .query(async ({ ctx, input }) => {
      await ensureDefaultDepartmentStatus(ctx.db, input.eventId)

      const statuses = await ctx.db.query.departmentEventStatus.findMany({
        where: eq(departmentEventStatus.eventId, input.eventId),
        with: {
          department: true,
        },
      })

      return statuses
    }),

  // List active departments
  departments: adminProcedure.query(async ({ ctx }) => {
    const departmentsList = await ctx.db
      .select()
      .from(department)
      .where(eq(department.active, true))

    return sortCoreDepartments(departmentsList)
  }),

  // Get audit log for an event
  auditLog: adminProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const logs = await ctx.db.query.eventAuditLog.findMany({
        where: eq(eventAuditLog.eventId, input.eventId),
        orderBy: desc(eventAuditLog.createdAt),
        with: {
          actor: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return logs
    }),
})
