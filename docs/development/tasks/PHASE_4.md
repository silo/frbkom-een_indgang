# Phase 4 – Auth & Sessions (Milestone M4)

Scope lines: CHECKLIST.md:118-126
Blocked by: Phases 0-2 (scaffold, data model, user flow)

## Tasks
- [x] Nets MitID/NemID OIDC routes: `/auth/login`, `/auth/callback`, `/auth/logout`, `/auth/refresh` (l118)
- [x] Session handling (nuxt-auth-utils) + secure cookies (l119)
- [ ] Admin AD OIDC integration under `/admin` (parallel flow) (issuer/client TBD) (l120)
- [x] Shared auth utilities (state, nonce, PKCE) (l121)
- [x] Route middleware `auth` enforcing login + role meta (l122)
- [x] Secure existing user routes (application flow, my events) (l123)
- [x] Admin landing page protected by role (l124)

## Acceptance Criteria
- User & admin can log in/out; all routes protected (l126)
