import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { getRequestURL, readRawBody, type H3Event } from 'h3'
import { appRouter } from '../../trpc/routers'
import { createContext } from '../../trpc/context'

export default defineEventHandler(async (event) => {
  const request = await toFetchRequest(event)

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () => createContext(event),
  })
})

const toFetchRequest = async (event: H3Event) => {
  const absoluteUrl = getRequestURL(event)
  const headers = new Headers()
  for (const [key, value] of Object.entries(event.node.req.headers)) {
    if (!value) continue
    if (Array.isArray(value)) {
      value.forEach((entry) => headers.append(key, entry))
      continue
    }
    headers.set(key, value)
  }

  const method = event.node.req.method ?? 'GET'
  const body = ['GET', 'HEAD'].includes(method)
    ? null
    : await readRawBody(event, { encoding: false })

  return new Request(absoluteUrl.toString(), {
    method,
    headers,
    body: body ?? undefined,
  })
}
