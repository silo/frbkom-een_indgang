import { defineEventHandler, sendRedirect } from 'h3'

import { buildNetsLogoutUrl, clearNetsOIDCSession } from '../../utils/nets-oidc'
import { clearUserSession, getUserSession } from '#auth-utils/server'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  await clearUserSession(event)
  clearNetsOIDCSession(event)

  const logoutUrl = await buildNetsLogoutUrl(event, session.secure?.idToken as string | undefined)
  return sendRedirect(event, logoutUrl, 302)
})
