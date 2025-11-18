import { defineEventHandler, readBody, sendRedirect, setResponseStatus, createError } from 'h3'

import {
  clearNetsOIDCSession,
  exchangeCodeForTokens,
  extractTokenClaims,
  getNetsOIDCSession,
} from '../../utils/nets-oidc'
import { findOrCreateUserFromClaims } from '../../utils/auth-user'
import { setUserSession } from '#auth-utils/server'

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

  const session = getNetsOIDCSession(event)

  if (session.state !== returnedState) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldig state-parameter' })
  }

  const tokens = await exchangeCodeForTokens(event, authorizationCode, session)
  const { idClaims, accessClaims } = extractTokenClaims(tokens.id_token, tokens.access_token)

  if (idClaims.nonce !== session.nonce) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt svar fra Nets (nonce mismatch)' })
  }

  const userRecord = await findOrCreateUserFromClaims({ ...accessClaims, ...idClaims })

  await setUserSession(event, {
    user: {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role,
      identityType: userRecord.identityType,
      phone: userRecord.phone,
      cpr: userRecord.cpr,
    },
    secure: {
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
    },
    expiresAt: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
    issuedAt: Date.now(),
  })

  clearNetsOIDCSession(event)

  const redirectTo = session.returnTo || '/'
  setResponseStatus(event, 302)
  return sendRedirect(event, redirectTo)
})
