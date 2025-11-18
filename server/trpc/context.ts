import { initTRPC, TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import superjson from 'superjson'
import type { H3Event } from 'h3'
import { db } from '../database/client'
import { user } from '../database/schema'
import { getUserSession } from '#auth-utils/server'

export interface Context {
  event: H3Event
  db: typeof db
  user: {
    id: string
    role: string
    email: string
  } | null
}

const DEV_USER_ID = '00000000-0000-0000-0000-000000000001'
const ENABLE_DEV_AUTH = process.env.ENABLE_DEV_AUTH === 'true'

const ensureDevUser = async () => {
  try {
    const existing = await db.select().from(user).where(eq(user.id, DEV_USER_ID)).limit(1)
    if (existing[0]) {
      return existing[0]
    }

    const [created] = await db
      .insert(user)
      .values({
        id: DEV_USER_ID,
        identityType: 'private',
        cpr: '1111111111',
        mitidUuid: 'dev-mitid-user',
        name: 'Dev Citizen',
        email: 'dev@example.com',
        phone: '00000000',
        role: 'admin',
        companyCvr: null,
        lastLoginAt: new Date(),
        lastIdp: 'dev',
      })
      .onConflictDoNothing()
      .returning()

    if (created) {
      return created
    }

    const retry = await db.select().from(user).where(eq(user.id, DEV_USER_ID)).limit(1)
    return retry[0] ?? null
  } catch (error) {
    console.warn('Dev auth user could not be ensured. Continuing without DB user.', error)
    return null
  }
}

export const createContext = async (event: H3Event): Promise<Context> => {
  let currentUser: Context['user'] = null

  const session = await getUserSession(event)

  if (session.user) {
    currentUser = {
      id: session.user.id,
      role: session.user.role,
      email: session.user.email,
    }
  } else if (ENABLE_DEV_AUTH) {
    const devUser = await ensureDevUser()
    currentUser = {
      id: devUser?.id ?? DEV_USER_ID,
      role: devUser?.role ?? 'admin',
      email: devUser?.email ?? 'dev@example.com',
    }
  }

  return {
    event,
    db,
    user: currentUser,
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
