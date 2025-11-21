import type { RuntimeConfig } from 'nuxt/schema'
import type { H3Event } from 'h3'
import { createError, deleteCookie, getCookie, getRequestURL, setCookie } from 'h3'

declare const useRuntimeConfig: () => RuntimeConfig

type AuthorizationServerMetadata = {
  issuer: string
  authorization_endpoint: string
  token_endpoint: string
  jwks_uri: string
  userinfo_endpoint?: string
  end_session_endpoint?: string
}

type AdminOIDCSession = {
  codeVerifier: string
  codeChallenge: string
  nonce: string
  state: string
  returnTo: string
}

type AdminTokenClaims = Record<string, unknown> & {
  sub: string
  aud: string | string[]
  exp: number
  iat: number
  nonce?: string
  name?: string
  preferred_username?: string
  email?: string
  oid?: string
  tid?: string
  upn?: string
  phone_number?: string
}

type TokenResponse = {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
  id_token?: string
  scope?: string
}

type AdminAuthRuntimeConfig = {
  adminAdIssuer?: string
  adminAdClientId?: string
  adminAdClientSecret?: string
}

const SESSION_COOKIE = 'admin-oidc-session'
let cachedMetadata: AuthorizationServerMetadata | null = null
let cachedExpiry = 0

const getRuntimeConfig = () => useRuntimeConfig() as AdminAuthRuntimeConfig

const requireAdminConfig = () => {
  const config = getRuntimeConfig()
  if (!config.adminAdIssuer || !config.adminAdClientId || !config.adminAdClientSecret) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Admin authentication is not configured',
    })
  }
  return config as Required<AdminAuthRuntimeConfig>
}

const base64UrlEncode = (input: ArrayBuffer | Uint8Array) => {
  const buffer = input instanceof Uint8Array ? input : new Uint8Array(input)
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

const randomString = (byteLength = 32) => {
  const array = new Uint8Array(byteLength)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

const createCodeChallenge = async (verifier: string) => {
  const encoded = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return base64UrlEncode(digest)
}

const getRedirectUri = (event: H3Event) => {
  const currentUrl = new URL(getRequestURL(event))
  return `${currentUrl.protocol}//${currentUrl.host}/api/admin-auth/callback`
}

const getBasicAuthHeader = (clientId: string, clientSecret: string) =>
  `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`

export const getAdminIssuerMetadata = async (): Promise<AuthorizationServerMetadata> => {
  const now = Date.now()
  if (cachedMetadata && cachedExpiry > now) {
    return cachedMetadata
  }

  const config = requireAdminConfig()
  const discoveryUrl = new URL('/.well-known/openid-configuration', config.adminAdIssuer)

  try {
    const response = await fetch(discoveryUrl)
    if (!response.ok) {
      throw new Error(`Discovery failed with status ${response.status}`)
    }

    const metadata = (await response.json()) as AuthorizationServerMetadata
    cachedMetadata = metadata
    cachedExpiry = now + 60 * 60 * 1000
    return metadata
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Admin authentication unavailable',
      cause: error,
    })
  }
}

export const createAdminOIDCSession = async (event: H3Event, returnTo = '/admin'): Promise<AdminOIDCSession> => {
  const codeVerifier = randomString(32)
  const codeChallenge = await createCodeChallenge(codeVerifier)
  const session: AdminOIDCSession = {
    codeVerifier,
    codeChallenge,
    nonce: randomString(32),
    state: randomString(32),
    returnTo,
  }

  setCookie(event, SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 60 * 10,
    path: '/',
  })

  return session
}

export const getAdminOIDCSession = (event: H3Event): AdminOIDCSession => {
  const value = getCookie(event, SESSION_COOKIE)
  if (!value) {
    throw createError({ statusCode: 400, statusMessage: 'Admin authentication session expired' })
  }

  try {
    const session = JSON.parse(value) as AdminOIDCSession
    if (!session.state || !session.nonce || !session.codeVerifier || !session.codeChallenge) {
      throw new Error('Invalid session payload')
    }
    return session
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid admin authentication session' })
  }
}

export const clearAdminOIDCSession = (event: H3Event) => {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export const buildAdminAuthorizationUrl = async (
  event: H3Event,
  session: AdminOIDCSession,
): Promise<string> => {
  const metadata = await getAdminIssuerMetadata()
  const config = requireAdminConfig()
  const authUrl = new URL(metadata.authorization_endpoint)
  const redirectUri = getRedirectUri(event)

  authUrl.searchParams.set('client_id', config.adminAdClientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', 'openid profile email offline_access')
  authUrl.searchParams.set('code_challenge', session.codeChallenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')
  authUrl.searchParams.set('state', session.state)
  authUrl.searchParams.set('nonce', session.nonce)
  authUrl.searchParams.set('response_mode', 'form_post')

  return authUrl.toString()
}

export const exchangeAdminCodeForTokens = async (
  event: H3Event,
  code: string,
  session: AdminOIDCSession,
): Promise<TokenResponse> => {
  const metadata = await getAdminIssuerMetadata()
  const config = requireAdminConfig()
  const redirectUri = getRedirectUri(event)

  try {
    const response = await fetch(metadata.token_endpoint, {
      method: 'POST',
      headers: {
        Authorization: getBasicAuthHeader(config.adminAdClientId, config.adminAdClientSecret),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: config.adminAdClientId,
        code_verifier: session.codeVerifier,
      }),
    })

    if (!response.ok) {
      throw new Error(`Token exchange failed with status ${response.status}`)
    }

    return (await response.json()) as TokenResponse
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Admin authentication failed', cause: error })
  }
}

const decodeJwtPayload = <T extends AdminTokenClaims>(token?: string): T => {
  if (!token) {
    return {} as T
  }

  const parts = token.split('.')
  if (parts.length < 2) {
    throw new Error('Invalid token format')
  }

  const payload = parts[1]!
  const normalized = payload
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=')

  const json = Buffer.from(normalized, 'base64').toString('utf8')
  return JSON.parse(json) as T
}

export const extractAdminTokenClaims = (idToken?: string, accessToken?: string) => {
  const idClaims = decodeJwtPayload(idToken)
  const accessClaims = decodeJwtPayload(accessToken)
  return { idClaims, accessClaims }
}

export const buildAdminLogoutUrl = async (event: H3Event, idToken?: string): Promise<string> => {
  const metadata = await getAdminIssuerMetadata()
  if (!metadata.end_session_endpoint) {
    return '/admin'
  }

  const currentUrl = new URL(getRequestURL(event))
  const postLogoutRedirectUri = `${currentUrl.protocol}//${currentUrl.host}/admin`
  const logoutUrl = new URL(metadata.end_session_endpoint)
  logoutUrl.searchParams.set('post_logout_redirect_uri', postLogoutRedirectUri)

  if (idToken) {
    logoutUrl.searchParams.set('id_token_hint', idToken)
  }

  return logoutUrl.toString()
}

export type { AdminOIDCSession, AdminTokenClaims }
