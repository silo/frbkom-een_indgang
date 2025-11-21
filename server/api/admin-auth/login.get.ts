import { defineEventHandler, getQuery, sendRedirect } from 'h3'

import { buildAdminAuthorizationUrl, createAdminOIDCSession } from '../../utils/admin-oidc'

const sanitizeReturnPath = (value?: string) => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return '/admin'
  }

  if (value.startsWith('/auth/') || value.startsWith('/api/auth/')) {
    return '/admin'
  }

  return value
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const returnTo = sanitizeReturnPath(query.returnTo as string | undefined)
  const session = await createAdminOIDCSession(event, returnTo)
  const authorizationUrl = await buildAdminAuthorizationUrl(event, session)

  return sendRedirect(event, authorizationUrl, 302)
})
