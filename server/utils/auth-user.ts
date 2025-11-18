import { createError } from 'h3'
import { eq, or } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'

import { db } from '../database/client'
import { user } from '../database/schema/user'
import type { NetsTokenClaims } from './nets-oidc'

export type AuthenticatedUser = InferSelectModel<typeof user>

export const findOrCreateUserFromClaims = async (claims: NetsTokenClaims): Promise<AuthenticatedUser> => {
  const mitidUuid = String(claims['mitid.uuid'] ?? claims.sub ?? '')
  const cpr = String(claims['da.cpr'] ?? '')

  if (!mitidUuid || !cpr) {
    throw createError({ statusCode: 422, statusMessage: 'Missing identity claims' })
  }

  const matchConditions = [eq(user.mitidUuid, mitidUuid), eq(user.cpr, cpr)]
  const existing = (
    await db.select().from(user).where(or(...matchConditions)).limit(1)
  )[0]

  if (existing) {
    return updateUserProfile(existing.id, claims)
  }

  const [created] = await db
    .insert(user)
    .values({
      identityType: mapIdentityType(claims.identity_type),
      cpr,
      mitidUuid,
      name: deriveName(claims),
      email: deriveEmail(claims, mitidUuid),
      phone: derivePhone(claims),
      companyCvr: typeof claims['mitid.cvr'] === 'string' ? claims['mitid.cvr'] : null,
    })
    .returning()

  if (!created) {
    throw createError({ statusCode: 500, statusMessage: 'Unable to create user record' })
  }

  return created
}

export const updateUserProfile = async (userId: string, claims: NetsTokenClaims) => {
  const [updated] = await db
    .update(user)
    .set({
      name: deriveName(claims),
      email: deriveEmail(claims, String(claims['mitid.uuid'] ?? claims.sub ?? '')),
      phone: derivePhone(claims),
      lastLoginAt: new Date(),
      lastIdp: claims.idp,
      companyCvr: typeof claims['mitid.cvr'] === 'string' ? claims['mitid.cvr'] : null,
      identityType: mapIdentityType(claims.identity_type),
    })
    .where(eq(user.id, userId))
    .returning()

  if (!updated) {
    throw createError({ statusCode: 500, statusMessage: 'Unable to update user' })
  }

  return updated
}

const deriveName = (claims: NetsTokenClaims) => {
  const rawName = claims['mitid.identity_name']
  if (typeof rawName === 'string' && rawName.trim().length) {
    return rawName.trim()
  }

  const givenName = typeof claims.given_name === 'string' ? claims.given_name : ''
  const familyName = typeof claims.family_name === 'string' ? claims.family_name : ''
  const fallback = `${givenName} ${familyName}`.trim()

  if (fallback.length) {
    return fallback
  }

  return 'Ukendt Bruger'
}

const deriveEmail = (claims: NetsTokenClaims, fallbackKey: string) => {
  const emailClaim = claims.email
  if (typeof emailClaim === 'string' && emailClaim.includes('@')) {
    return emailClaim.toLowerCase()
  }

  const safeFallback = fallbackKey || 'unknown'
  return `${safeFallback}@midlertidig.frederiksberg.dk`
}

const derivePhone = (claims: NetsTokenClaims) => {
  const phone = claims.phone_number
  if (typeof phone === 'string' && phone.trim().length >= 8) {
    return phone.trim()
  }

  return '00000000'
}

const mapIdentityType = (identity?: string) => {
  if (identity === 'professional') {
    return 'professional'
  }
  return 'private'
}
