import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
// @ts-expect-error - H3 types provided by Nuxt at runtime
import type { H3Event } from 'h3'
import { db } from '../database/client'

export interface Context {
  event: H3Event
  db: typeof db
  user: {
    id: string
    role: string
    email: string
  } | null
}

export const createContext = async (event: H3Event): Promise<Context> => {
  // TODO: Get user from session in Phase 4
  // For now, return null user
  return {
    event,
    db,
    user: null,
  }
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

// Protected procedure (requires authentication)
export const protectedProcedure = t.procedure.use(async (opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
  }
  return opts.next({
    ctx: {
      ...opts.ctx,
      user: opts.ctx.user,
    },
  })
})

// Admin procedure (requires admin role)
export const adminProcedure = protectedProcedure.use(async (opts) => {
  if (opts.ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' })
  }
  return opts.next({
    ctx: opts.ctx,
  })
})
