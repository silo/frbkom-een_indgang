import type { H3Event } from 'h3'
import { createError, deleteCookie, getCookie, getRequestURL, setCookie } from 'h3'

export type AuthorizationServerMetadata = {
  issuer: string
  authorization_endpoint: string
  token_endpoint: string
  jwks_uri: string
  userinfo_endpoint?: string
  end_session_endpoint?: string
}

export type NetsOIDCSession = {
  code_verifier: string
  code_challenge: string
  nonce: string
  state: string
  returnTo?: string
}

export type NetsTokenClaims = Record<string, unknown> & {
  sub: string
  iss: string
  aud: string | string[]
  exp: number
  iat: number
  auth_time?: number
  nonce?: string
  neb_sid?: string
  session_expiry?: number
  identity_type?: 'private' | 'professional' | 'test'
  idp?: string
  email?: string
  given_name?: string
  family_name?: string
  phone_number?: string
  'da.cpr'?: string
  'mitid.uuid'?: string
  'mitid.identity_name'?: string
  'mitid.cvr'?: string
  'mitid.ial_identity_assurance_level'?: string
  'mitid.aal_authentication_assurance_level'?: string
}

export type NetsAuthorizationOptions = {
  idp?: 'mitid' | 'nemid'
  language?: 'da' | 'en' | 'kl'
  referenceText?: string
  forceAuthentication?: boolean
}

export type TokenResponse = {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
  id_token?: string
  scope?: string
}

type AuthRuntimeConfig = {
  netsClientSecret: string
  public: {
    netsIssuer: string
    netsClientId: string
  }
}

const getAuthConfig = () => useRuntimeConfig() as unknown as AuthRuntimeConfig

const SESSION_COOKIE = 'nets-oidc-session'
let cachedMetadata: AuthorizationServerMetadata | null = null
let cachedExpiry = 0

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
  return `${currentUrl.protocol}//${currentUrl.host}/auth/callback`
}

const getBasicAuthHeader = (clientId: string, clientSecret: string) =>
  `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`

export const getNetsIssuer = async (): Promise<AuthorizationServerMetadata> => {
  const now = Date.now()
  if (cachedMetadata && cachedExpiry > now) {
    return cachedMetadata
  }

  const config = getAuthConfig()
  const discoveryUrl = new URL('/.well-known/openid-configuration', config.public.netsIssuer)
  try {
    const response = await fetch(discoveryUrl)
    if (!response.ok) {
      throw new Error(`Discovery failed with status ${response.status}`)
    }
    const metadata = (await response.json()) as AuthorizationServerMetadata
    cachedMetadata = metadata
    cachedExpiry = now + 60 * 60 * 1000 // cache for 1 hour
    return metadata
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Authentication service unavailable',
      cause: error,
    })
  }
}

export const createNetsOIDCSession = async (event: H3Event, returnTo?: string): Promise<NetsOIDCSession> => {
  const code_verifier = randomString(32)
  const code_challenge = await createCodeChallenge(code_verifier)
  const session: NetsOIDCSession = {
    code_verifier,
    code_challenge,
    nonce: randomString(32),
    state: randomString(32),
    returnTo: returnTo || '/',
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

export const getNetsOIDCSession = (event: H3Event): NetsOIDCSession => {
  const value = getCookie(event, SESSION_COOKIE)
  if (!value) {
    throw createError({ statusCode: 400, statusMessage: 'Authentication session expired' })
  }

  try {
    const session = JSON.parse(value) as NetsOIDCSession
    if (!session.state || !session.nonce || !session.code_verifier || !session.code_challenge) {
      throw new Error('Invalid session payload')
    }
    return session
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid authentication session' })
  }
}

export const clearNetsOIDCSession = (event: H3Event) => {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export const buildNetsAuthorizationUrl = async (
  event: H3Event,
  session: NetsOIDCSession,
  options: NetsAuthorizationOptions = {},
): Promise<string> => {
  const issuer = await getNetsIssuer()
  const config = getAuthConfig()
  const authUrl = new URL(issuer.authorization_endpoint)
  const redirectUri = getRedirectUri(event)

  authUrl.searchParams.set('client_id', config.public.netsClientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', 'openid mitid ssn')
  authUrl.searchParams.set('code_challenge', session.code_challenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')
  authUrl.searchParams.set('state', session.state)
  authUrl.searchParams.set('nonce', session.nonce)
  authUrl.searchParams.set('response_mode', 'form_post')

  if (options.idp) {
    authUrl.searchParams.set('idp_values', options.idp)
  }

  if (options.language) {
    authUrl.searchParams.set('ui_locales', options.language)
  }

  if (options.forceAuthentication) {
    authUrl.searchParams.set('prompt', 'login')
    authUrl.searchParams.set('max_age', '0')
  }

  if (options.referenceText) {
    const encoded = Buffer.from(options.referenceText).toString('base64')
    authUrl.searchParams.set(
      'idp_params',
      JSON.stringify({
        mitid: { reference_text: encoded },
      }),
    )
  }

  return authUrl.toString()
}

export const exchangeCodeForTokens = async (
  event: H3Event,
  code: string,
  session: NetsOIDCSession,
): Promise<TokenResponse> => {
  const issuer = await getNetsIssuer()
  const config = getAuthConfig()
  const redirectUri = getRedirectUri(event)

  try {
    const response = await fetch(issuer.token_endpoint, {
      method: 'POST',
      headers: {
        Authorization: getBasicAuthHeader(config.public.netsClientId, config.netsClientSecret),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: config.public.netsClientId,
        code_verifier: session.code_verifier,
      }),
    })

    if (!response.ok) {
      throw new Error(`Token exchange failed with status ${response.status}`)
    }

    return (await response.json()) as TokenResponse
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication failed', cause: error })
  }
}

export const refreshTokens = async (event: H3Event, refreshToken: string): Promise<TokenResponse> => {
  const issuer = await getNetsIssuer()
  const config = getAuthConfig()
  try {
    const response = await fetch(issuer.token_endpoint, {
      method: 'POST',
      headers: {
        Authorization: getBasicAuthHeader(config.public.netsClientId, config.netsClientSecret),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: config.public.netsClientId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Refresh failed with status ${response.status}`)
    }

    return (await response.json()) as TokenResponse
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Token refresh failed', cause: error })
  }
}

const decodeJwtPayload = <T extends NetsTokenClaims>(token?: string): T => {
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

export const extractTokenClaims = (idToken?: string, accessToken?: string) => {
  const idClaims = decodeJwtPayload(idToken)
  const accessClaims = decodeJwtPayload(accessToken)
  return { idClaims, accessClaims }
}

export const buildNetsLogoutUrl = async (event: H3Event, idToken?: string): Promise<string> => {
  const issuer = await getNetsIssuer()
  if (!issuer.end_session_endpoint || !idToken) {
    return '/'
  }

  const currentUrl = new URL(getRequestURL(event))
  const postLogoutRedirectUri = `${currentUrl.protocol}//${currentUrl.host}/`
  const logoutUrl = new URL(issuer.end_session_endpoint)
  logoutUrl.searchParams.set('post_logout_redirect_uri', postLogoutRedirectUri)
  logoutUrl.searchParams.set('id_token_hint', idToken)
  return logoutUrl.toString()
}
