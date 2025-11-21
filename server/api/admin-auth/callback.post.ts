import { createError, defineEventHandler, readBody, sendRedirect, setResponseStatus } from 'h3'

import {
  clearAdminOIDCSession,
  exchangeAdminCodeForTokens,
  extractAdminTokenClaims,
  getAdminOIDCSession,
  type AdminTokenClaims,
} from '../../utils/admin-oidc'
import { setUserSession } from '#auth-utils/server'

const mapClaimsToAdminUser = (claims: AdminTokenClaims) => {
  const subject = typeof claims.oid === 'string' && claims.oid.length ? claims.oid : claims.sub
  if (!subject) {
    throw createError({ statusCode: 401, statusMessage: 'Ugyldig admin-identitet' })
  }

  const email = [claims.email, claims.preferred_username, claims.upn]
    .map((value) => (typeof value === 'string' ? value.trim().toLowerCase() : ''))
    .find((value) => value.includes('@'))

  const name = typeof claims.name === 'string' && claims.name.trim().length ? claims.name.trim() : 'Administrator'
  const phone = typeof claims.phone_number === 'string' ? claims.phone_number.trim() : '00000000'

  return {
    id: subject,
    email: email || `${subject}@admin.frederiksberg.dk`,
    name,
    role: 'admin' as const,
    identityType: 'professional' as const,
    phone: phone || '00000000',
    cpr: 'ADMIN',
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, string | undefined>>(event)
  if (body.error) {
    throw createError({ statusCode: 401, statusMessage: body.error_description || body.error })
  }

  const authorizationCode = body.code
  const returnedState = body.state

  if (!authorizationCode) {
    throw createError({ statusCode: 400, statusMessage: 'Manglende autorisationskode' })
  }

  const session = getAdminOIDCSession(event)

  if (session.state !== returnedState) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldig state-parameter' })
  }

  const tokens = await exchangeAdminCodeForTokens(event, authorizationCode, session)
  const { idClaims } = extractAdminTokenClaims(tokens.id_token, tokens.access_token)

  if (idClaims.nonce !== session.nonce) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt svar fra Microsoft (nonce mismatch)' })
  }

  const adminUser = mapClaimsToAdminUser(idClaims)

  await setUserSession(event, {
    user: adminUser,
    secure: {
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
    },
    expiresAt: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
    issuedAt: Date.now(),
  })

  clearAdminOIDCSession(event)

  const redirectTo = session.returnTo || '/admin'
  setResponseStatus(event, 302)
  return sendRedirect(event, redirectTo)
})
