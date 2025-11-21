import { TRPCError } from '@trpc/server'
import { eq, inArray } from 'drizzle-orm'
import { router, adminProcedure, type Context } from '../context'
import { z } from 'zod'
import { reviewStatusEnum } from '../../../shared/schemas/event'
import {
  updateDepartmentStatusSchema,
  listDepartmentStatusesSchema,
} from '../../../shared/schemas/department-status'
import {
  eventApplication,
  departmentEventStatus,
  eventAuditLog,
  department,
  eventDocument,
  eventTypeTag,
  eventTypeTagLink,
  eventSafetyInfo,
  eventSoundInfo,
  eventWasteInfo,
  eventAccessInfo,
  eventFoodInfo,
} from '../../database/schema'
import {
  CORE_DEPARTMENT_SLUGS,
  type CoreDepartmentSlug,
  ensureDefaultDepartmentStatus,
  sortCoreDepartments,
} from '../../utils/department-defaults'
import {
  sendApprovalEmail,
  sendDepartmentNotificationEmail,
  sendRejectionEmail,
} from '../../utils/email'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const emailDateFormatter = new Intl.DateTimeFormat('da-DK', { dateStyle: 'medium' })
const departmentEmailMap: Record<CoreDepartmentSlug, string | undefined> = {
  'byliv-drift': process.env.NUXT_DEPARTMENT_EMAIL_BYLIV_DRIFT,
  'klima-miljo': process.env.NUXT_DEPARTMENT_EMAIL_KLIMA_MILJO,
  'byggeri-arkitektur': process.env.NUXT_DEPARTMENT_EMAIL_BYGGERI_ARKITEKTUR,
}

const formatDateRangeForEmail = (start: Date, end: Date) =>
  `${emailDateFormatter.format(start)} - ${emailDateFormatter.format(end)}`

const getDepartmentEmail = (slug: CoreDepartmentSlug) => departmentEmailMap[slug]

const getDbQuery = (database: Context['db']) =>
  (database as Context['db'] & { query: Record<string, any> }).query as Record<string, any>

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
      const dbQuery = getDbQuery(ctx.db)

      const events = await dbQuery.eventApplication.findMany({
        where: (events: any, { and, eq, ilike, or }: any) => {
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
        orderBy: (events: any, { desc }: any) => [desc(events.createdAt)],
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
          locationPreset: true,
        },
      })

      if (!events.length) {
        return events.map((event: typeof events[number]) => ({ ...event, typeTags: [], departments: [] }))
      }

      const eventIds = events.map((event: typeof events[number]) => event.id)

      const [typeTagRows, departmentRows] = await Promise.all([
        ctx.db
          .select({
            eventId: eventTypeTagLink.eventId,
            tagId: eventTypeTag.id,
            tagName: eventTypeTag.nameDa,
          })
          .from(eventTypeTagLink)
          .innerJoin(eventTypeTag, eq(eventTypeTag.id, eventTypeTagLink.tagId))
          .where(inArray(eventTypeTagLink.eventId, eventIds)),
        ctx.db
          .select({
            eventId: departmentEventStatus.eventId,
            departmentName: department.name,
          })
          .from(departmentEventStatus)
          .innerJoin(department, eq(department.id, departmentEventStatus.departmentId))
          .where(inArray(departmentEventStatus.eventId, eventIds)),
      ])

      const typeTagMap = new Map<string, { id: string; name: string }[]>()
      typeTagRows.forEach(({ eventId, tagId, tagName }) => {
        const next = typeTagMap.get(eventId) ?? []
        next.push({ id: tagId, name: tagName })
        typeTagMap.set(eventId, next)
      })

      const departmentMap = new Map<string, string[]>()
      departmentRows.forEach(({ eventId, departmentName }) => {
        const next = departmentMap.get(eventId) ?? []
        next.push(departmentName)
        departmentMap.set(eventId, next)
      })

      return events.map((event: typeof events[number]) => ({
        ...event,
        typeTags: typeTagMap.get(event.id) ?? [],
        departments: departmentMap.get(event.id) ?? [],
      }))
    }),

  // Get event by ID (admin view with full details)
  byId: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const dbQuery = getDbQuery(ctx.db)
      const event = await dbQuery.eventApplication.findFirst({
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
          locationPreset: true,
        },
      })

      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      }

      const typeTags = await ctx.db
        .select({
          id: eventTypeTag.id,
          code: eventTypeTag.code,
          name: eventTypeTag.nameDa,
        })
        .from(eventTypeTagLink)
        .innerJoin(eventTypeTag, eq(eventTypeTag.id, eventTypeTagLink.tagId))
        .where(eq(eventTypeTagLink.eventId, input.id))

      const [safetyRows, soundRows, wasteRows, foodRows, accessRows] = await Promise.all([
        ctx.db
          .select()
          .from(eventSafetyInfo)
          .where(eq(eventSafetyInfo.eventId, input.id))
          .limit(1),
        ctx.db
          .select()
          .from(eventSoundInfo)
          .where(eq(eventSoundInfo.eventId, input.id))
          .limit(1),
        ctx.db
          .select()
          .from(eventWasteInfo)
          .where(eq(eventWasteInfo.eventId, input.id))
          .limit(1),
        ctx.db
          .select()
          .from(eventFoodInfo)
          .where(eq(eventFoodInfo.eventId, input.id))
          .limit(1),
        ctx.db
          .select()
          .from(eventAccessInfo)
          .where(eq(eventAccessInfo.eventId, input.id))
          .limit(1),
      ])

      const safetyInfo = safetyRows[0] ?? null
      const soundInfo = soundRows[0] ?? null
      const wasteInfo = wasteRows[0] ?? null
      const foodInfo = foodRows[0] ?? null
      const accessInfo = accessRows[0] ?? null

      return {
        event,
        typeTags,
        safetyInfo,
        soundInfo,
        wasteInfo,
        foodInfo,
        accessInfo,
      }
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
      const dbQuery = getDbQuery(ctx.db)

      if (input.reviewStatus === 'rejected' && !trimmedNote) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'A rejection note is required when rejecting an event',
        })
      }

      const event = await dbQuery.eventApplication.findFirst({
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

  sendApprovalNotice: adminProcedure
    .input(
      z.object({
        eventId: z.string().uuid(),
        departmentId: z.string().uuid(),
        message: z.string().min(10),
        attachment: z
          .object({
            fileName: z.string().min(1).max(255),
            mimeType: z.literal('application/pdf'),
            sizeBytes: z
              .number()
              .int()
              .min(1)
              .max(MAX_FILE_SIZE_BYTES, 'File size exceeds 5MB'),
            content: z.string().min(1),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbQuery = getDbQuery(ctx.db)
      const event = await dbQuery.eventApplication.findFirst({
        where: eq(eventApplication.id, input.eventId),
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

      if (!event.owner?.email) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Applicant email is missing for this event',
        })
      }

      const [targetDepartment] = await ctx.db
        .select()
        .from(department)
        .where(eq(department.id, input.departmentId))
        .limit(1)

      if (!targetDepartment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Department not found' })
      }

      let uploadedDocumentId: string | null = null

      if (input.attachment) {
        const [document] = await ctx.db
          .insert(eventDocument)
          .values({
            eventId: input.eventId,
            kind: 'approval_document',
            fileName: input.attachment.fileName,
            mimeType: input.attachment.mimeType,
            sizeBytes: input.attachment.sizeBytes,
            content: input.attachment.content,
          })
          .returning({ id: eventDocument.id, fileName: eventDocument.fileName })

        if (!document) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Document upload failed',
          })
        }

        uploadedDocumentId = document.id

        await ctx.db.insert(eventAuditLog).values({
          eventId: input.eventId,
          actorUserId: ctx.user.id,
          action: 'add_document',
          payload: {
            documentId: document.id,
            fileName: document.fileName,
            kind: 'approval_document',
          },
        })
      }

      await sendApprovalEmail({
        to: event.owner.email,
        applicantName: event.owner.name,
        eventTitle: event.title,
        departmentName: targetDepartment.name,
        adminMessage: input.message,
      })

      await ctx.db.insert(eventAuditLog).values({
        eventId: input.eventId,
        actorUserId: ctx.user.id,
        action: 'status_change',
        payload: {
          toStatus: 'approved',
          note: input.message,
        },
      })

      return {
        success: true,
        documentId: uploadedDocumentId,
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

  assignDepartments: adminProcedure
    .input(
      z.object({
        eventId: z.string().uuid(),
        departmentIds: z.array(z.string().uuid()).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbQuery = getDbQuery(ctx.db)
      const uniqueDepartmentIds = [...new Set(input.departmentIds)]
      const event = await dbQuery.eventApplication.findFirst({
        where: eq(eventApplication.id, input.eventId),
        with: {
          owner: {
            columns: {
              name: true,
            },
          },
          locationPreset: true,
        },
      })

      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      }

      const existing = await ctx.db
        .select({ departmentId: departmentEventStatus.departmentId })
        .from(departmentEventStatus)
        .where(eq(departmentEventStatus.eventId, input.eventId))

      const existingSet = new Set(existing.map((entry) => entry.departmentId))
      const newDepartmentIds = uniqueDepartmentIds.filter((id) => !existingSet.has(id))

      if (!newDepartmentIds.length) {
        return { created: 0 }
      }

      const departmentsToAssign = await ctx.db
        .select()
        .from(department)
        .where(inArray(department.id, newDepartmentIds))

      if (!departmentsToAssign.length) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No matching departments found' })
      }

      const now = new Date()
      await ctx.db
        .insert(departmentEventStatus)
        .values(
          departmentsToAssign.map((dept) => ({
            eventId: input.eventId,
            departmentId: dept.id,
            status: 'pending' as const,
            note: null,
            updatedAt: now,
          })),
        )
        .onConflictDoNothing()

        const eventLocation = event.locationAddress ?? event.locationPreset?.name ?? null
        const eventDates = formatDateRangeForEmail(event.startAt, event.endAt)

      await Promise.all(
        departmentsToAssign.map(async (dept) => {
          const slug = dept.slug as CoreDepartmentSlug
          if (!CORE_DEPARTMENT_SLUGS.includes(slug)) {
            return
          }
          const recipient = getDepartmentEmail(slug)
          if (!recipient) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `Missing email configuration for department ${dept.name}`,
            })
          }
          await sendDepartmentNotificationEmail({
            to: recipient,
            departmentName: dept.name,
            eventTitle: event.event.title,
            eventLocation,
            eventDates,
            applicantName: event.event.owner?.name ?? null,
          })
        }),
      )

      await ctx.db.insert(eventAuditLog).values({
        eventId: input.eventId,
        actorUserId: ctx.user.id,
        action: 'update',
        payload: {
          note: `Departments notified: ${departmentsToAssign
            .map((dept) => dept.name)
            .join(', ')}`,
        },
      })

      return { created: departmentsToAssign.length }
    }),

  // List department statuses for an event
  listDepartmentStatuses: adminProcedure
    .input(listDepartmentStatusesSchema)
    .query(async ({ ctx, input }) => {
      await ensureDefaultDepartmentStatus(ctx.db, input.eventId)
      const dbQuery = getDbQuery(ctx.db)

      const statuses = await dbQuery.departmentEventStatus.findMany({
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
      const dbQuery = getDbQuery(ctx.db)
      const logs = await dbQuery.eventAuditLog.findMany({
        where: eq(eventAuditLog.eventId, input.eventId),
        orderBy: (logs: any, { desc }: any) => [desc(logs.createdAt)],
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
