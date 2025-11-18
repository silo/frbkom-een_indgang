import type { UserSession } from '#auth-utils'

declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    name: string
    role: 'user' | 'admin'
    identityType: 'private' | 'professional'
    phone: string
    cpr: string
  }

  interface SecureSessionData {
    refreshToken?: string
    idToken?: string
  }

  interface UserSession {
    user?: User
    secure?: SecureSessionData
    expiresAt?: number
    issuedAt?: number
  }
}

export {}
