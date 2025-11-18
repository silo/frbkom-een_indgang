import { defineEventHandler, getQuery, sendRedirect } from 'h3'

import { buildNetsAuthorizationUrl, createNetsOIDCSession } from '../../utils/nets-oidc'

const sanitizeReturnPath = (value?: string) => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return '/'
  }

  if (value.startsWith('/auth/') || value.startsWith('/api/auth/')) {
    return '/'
  }

  return value
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const returnTo = sanitizeReturnPath(query.returnTo as string | undefined)
  const session = await createNetsOIDCSession(event, returnTo)
  const authorizationUrl = await buildNetsAuthorizationUrl(event, session, {
    idp: 'mitid',
    language: 'da',
  })

  return sendRedirect(event, authorizationUrl, 302)
})
