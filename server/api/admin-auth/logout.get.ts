import { defineEventHandler, sendRedirect } from 'h3'

import { buildAdminLogoutUrl, clearAdminOIDCSession } from '../../utils/admin-oidc'
import { clearUserSession, getUserSession } from '#auth-utils/server'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  await clearUserSession(event)
  clearAdminOIDCSession(event)

  const logoutUrl = await buildAdminLogoutUrl(event, session?.secure?.idToken)
  return sendRedirect(event, logoutUrl, 302)
})
