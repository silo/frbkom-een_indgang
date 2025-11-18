import { createError, defineEventHandler, readBody } from 'h3'

import { setUserSession } from '#auth-utils/server'
import { DEV_TEST_USER_PRESETS } from '~~/shared/dev-test-users'
import type { DevTestUserPresetKey } from '~~/shared/dev-test-users'

const isDevAuthEnabled = process.env.ENABLE_DEV_AUTH === 'true'

export default defineEventHandler(async (event) => {
  if (!isDevAuthEnabled) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const body = await readBody<{
    role?: 'admin' | 'user'
    name?: string
    presetKey?: DevTestUserPresetKey | null
  }>(event)

  const preset = DEV_TEST_USER_PRESETS.find((entry) => entry.key === body.presetKey)
  const role: 'admin' | 'user' = preset?.role ?? (body.role === 'admin' ? 'admin' : 'user')

  const now = Date.now()
  const mockSource = preset
    ? {
        userId: preset.userId,
        name: body.name || preset.name,
        email: preset.email,
        phone: preset.phone,
        cpr: preset.cpr,
        identityType: preset.identityType,
        role: preset.role,
      }
    : {
        userId: role === 'admin' ? 'dev-admin-user' : 'dev-citizen-user',
        name: body.name || (role === 'admin' ? 'Dev Administrator' : 'Dev Citizen'),
        email: `${role === 'admin' ? 'dev-admin-user' : 'dev-citizen-user'}@local.dev`,
        phone: '00000000',
        cpr: role === 'admin' ? '1111111111' : '2222222222',
        identityType: role === 'admin' ? 'professional' : 'private',
        role,
      }

  const mockUser = {
    id: mockSource.userId,
    email: mockSource.email,
    name: mockSource.name,
    role: mockSource.role,
    identityType: mockSource.identityType,
    phone: mockSource.phone,
    cpr: mockSource.cpr,
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
