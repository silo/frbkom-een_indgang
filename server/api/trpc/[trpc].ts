import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '../../trpc/routers'
import { createContext } from '../../trpc/context'

export default defineEventHandler(async (event) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: event.node.req,
    router: appRouter,
    createContext: () => createContext(event),
  })
})
