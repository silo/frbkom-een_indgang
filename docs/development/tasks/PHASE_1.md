# Phase 1 – Auth & Sessions (Milestone M1)

Scope lines: CHECKLIST.md:23-30
Blocked by: Phase 0

## Tasks
- [ ] Nets MitID/NemID OIDC routes: `/auth/login`, `/auth/callback`, `/auth/logout`, `/auth/refresh` (l23)
- [ ] Session handling (nuxt-auth-utils) + secure cookies (l24)
- [ ] Admin AD OIDC integration under `/admin` (parallel flow) (issuer/client TBD) (l25)
- [ ] Shared auth utilities (state, nonce, PKCE) (l26)
- [ ] Route middleware `auth` enforcing login + role meta (l27)
- [ ] Public pages: `index`, `dashboard` using session state (l28)
- [ ] Admin landing page protected by role (l29)

## Acceptance Criteria
- User & admin can log in/out; protected routes enforced (l31)
