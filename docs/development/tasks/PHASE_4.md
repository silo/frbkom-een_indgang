# Phase 4 – Auth & Sessions (Milestone M4)

Scope lines: CHECKLIST.md:118-126
Blocked by: Phases 0-2 (scaffold, data model, user flow)

## Tasks
- [ ] Nets MitID/NemID OIDC routes: `/auth/login`, `/auth/callback`, `/auth/logout`, `/auth/refresh` (l118)
- [ ] Session handling (nuxt-auth-utils) + secure cookies (l119)
- [ ] Admin AD OIDC integration under `/admin` (parallel flow) (issuer/client TBD) (l120)
- [ ] Shared auth utilities (state, nonce, PKCE) (l121)
- [ ] Route middleware `auth` enforcing login + role meta (l122)
- [ ] Secure existing user routes (application flow, my events) (l123)
- [ ] Admin landing page protected by role (l124)

## Acceptance Criteria
- User & admin can log in/out; all routes protected (l126)
