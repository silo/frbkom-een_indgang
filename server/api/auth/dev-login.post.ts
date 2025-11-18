import { createError, defineEventHandler, readBody } from 'h3'

import { findOrCreateUserFromClaims } from '../../utils/auth-user'
import { setUserSession } from '#auth-utils/server'

const isDevAuthEnabled = process.env.ENABLE_DEV_AUTH === 'true'

export default defineEventHandler(async (event) => {
  if (!isDevAuthEnabled) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const body = await readBody<{ role?: 'admin' | 'user'; name?: string }>(event)
  const role = body.role === 'admin' ? 'admin' : 'user'
  const now = Math.floor(Date.now() / 1000)
  const fakeUuid = role === 'admin' ? 'dev-admin-user' : 'dev-citizen-user'
  const fakeCpr = role === 'admin' ? '1111111111' : '2222222222'

  const claims = await findOrCreateUserFromClaims({
    sub: fakeUuid,
    iss: 'dev-auth',
    aud: 'dev-app',
    exp: now + 3600,
    iat: now,
    identity_type: role === 'admin' ? 'professional' : 'private',
    idp: 'dev',
    'mitid.uuid': fakeUuid,
    'da.cpr': fakeCpr,
    'mitid.identity_name': body.name || (role === 'admin' ? 'Dev Administrator' : 'Dev Citizen'),
  })

  await setUserSession(event, {
    user: {
      id: claims.id,
      email: claims.email,
      name: claims.name,
      role: claims.role,
      identityType: claims.identityType,
      phone: claims.phone,
      cpr: claims.cpr,
    },
    secure: {
      refreshToken: 'dev-refresh-token',
      idToken: 'dev-id-token',
    },
    expiresAt: Date.now() + 3600 * 1000,
    issuedAt: Date.now(),
  })

  return { ok: true }
})
