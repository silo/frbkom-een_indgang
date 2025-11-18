import { createError, defineEventHandler, readBody } from 'h3'

import { setUserSession } from '#auth-utils/server'

const isDevAuthEnabled = process.env.ENABLE_DEV_AUTH === 'true'

export default defineEventHandler(async (event) => {
  if (!isDevAuthEnabled) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const body = await readBody<{ role?: 'admin' | 'user'; name?: string }>(event)
  const role: 'admin' | 'user' = body.role === 'admin' ? 'admin' : 'user'

  const now = Date.now()
  const fakeUuid = role === 'admin' ? 'dev-admin-user' : 'dev-citizen-user'
  const fakeCpr = role === 'admin' ? '1111111111' : '2222222222'

  const mockUser = {
    id: fakeUuid,
    email: `${fakeUuid}@local.dev`,
    name: body.name || (role === 'admin' ? 'Dev Administrator' : 'Dev Citizen'),
    role,
    identityType: role === 'admin' ? 'professional' : 'private',
    phone: '00000000',
    cpr: fakeCpr,
  }

  await setUserSession(event, {
    user: mockUser,
    secure: {
      refreshToken: 'dev-refresh-token',
      idToken: 'dev-id-token',
    },
    expiresAt: now + 3600 * 1000,
    issuedAt: now,
  })

  return { ok: true, user: mockUser }
})
