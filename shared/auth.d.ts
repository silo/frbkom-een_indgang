declare module '#auth-utils' {
  interface User {
    id: string
    sessionId: string
    name?: string
    email?: string
    cpr?: string
    mitidUuid?: string
    identityType: 'private' | 'professional' | 'test'
    idp: string
    ial?: string
    aal?: string
    authTime?: number
    sessionExpiry?: number
    role: 'user' | 'admin'
    permissions?: string[]
  }

  interface UserSession {
    access_token?: string
    id_token?: string
    refresh_token?: string
    expires_at?: number
    issued_at?: number
  }
}

export {}
