import { router, protectedProcedure } from '../context'
import { user } from '../../database/schema'
import { eq } from 'drizzle-orm'

export const userRouter = router({
  // Get current user info
  me: protectedProcedure.query(async ({ ctx }) => {
    const currentUser = await ctx.db.query.user.findFirst({
      where: eq(user.id, ctx.user.id),
      columns: {
        id: true,
        identityType: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        companyCvr: true,
        lastLoginAt: true,
        // Don't expose CPR or mitidUuid
      },
    })

    return currentUser
  }),

  // Get user's events
  myEvents: protectedProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.query.eventApplication.findMany({
      where: (events, { eq }) => eq(events.ownerUserId, ctx.user.id),
      orderBy: (events, { desc }) => [desc(events.createdAt)],
    })

    return events
  }),
})
