import { createError, defineEventHandler } from 'h3'

import { refreshTokens } from '../../utils/nets-oidc'
import { getUserSession, replaceUserSession } from '#auth-utils/server'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const refreshToken = session.secure?.refreshToken as string | undefined

  if (!refreshToken) {
    throw createError({ statusCode: 400, statusMessage: 'Ingen refresh token tilgængelig' })
  }

  const tokens = await refreshTokens(event, refreshToken)
  const { id, ...sessionData } = session

  await replaceUserSession(event, {
    ...sessionData,
    secure: {
      ...(sessionData.secure || {}),
      refreshToken: tokens.refresh_token || refreshToken,
      idToken: tokens.id_token || sessionData.secure?.idToken,
    },
    expiresAt: tokens.expires_in ? Date.now() + (tokens.expires_in * 1000) : sessionData.expiresAt,
    issuedAt: Date.now(),
  })

  return { ok: true }
})
