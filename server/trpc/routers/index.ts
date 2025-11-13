import { router } from '../context'
import { userRouter } from './user'
import { eventsRouter } from './events'
import { artifactsRouter } from './artifacts'
import { documentsRouter } from './documents'
import { adminRouter } from './admin'

export const appRouter = router({
  user: userRouter,
  events: eventsRouter,
  artifacts: artifactsRouter,
  documents: documentsRouter,
  admin: adminRouter,
})

export type AppRouter = typeof appRouter
