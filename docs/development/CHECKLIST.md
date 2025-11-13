# v1 Development Checklist

Scope: All v1 features explicitly defined in /docs. (No payments, CPR encryption, GeoJSON, advanced security pinning.)

Legend: `[ ]` pending · `[~]` in progress · `[x]` done

---
## Phase 0 – Project Setup
- [ ] Initialize Nuxt 4 project structure (layouts, pages scaffold)
- [ ] Configure TypeScript strict + path aliases
- [ ] Add ESLint flat config + Prettier
- [ ] Install `fk_designsystem` (local file dependency)
- [ ] Integrate design tokens (colors, spacing, typography)
- [ ] Create base layouts: `default`, `admin`
- [ ] Setup i18n folder + da-DK locale file
- [ ] Add initial runtime config + env example entries

Milestone M0: Development scaffold runs (`pnpm dev`) with lint passing.
Dependencies: None (root phase).

---
## Phase 1 – Data Model & API
Schema (Drizzle + migrations + seeds):
- [ ] `user`
- [ ] `department`
- [ ] `event_application`
- [ ] `event_artifact`
- [ ] `event_document`
- [ ] `event_sound_info`
- [ ] `event_waste_info`
- [ ] `event_food_info`
- [ ] `event_safety_info`
- [ ] `event_access_info`
- [ ] `event_status_history`
- [ ] `department_event_status`
- [ ] `event_audit_log`
- [ ] `location_preset`
- [ ] `event_type_tag` + link table
- [ ] Seeds: departments, type tags, location presets

Zod Schemas:
- [ ] Event create/update
- [ ] Artifacts CRUD
- [ ] Documents upload metadata
- [ ] Per-info tables (sound/waste/food/safety/access)
- [ ] Department status update

tRPC Routers:
- [ ] `user` (me, myEvents)
- [ ] `events` (create, update, saveDraft, submit, get/byId, listMine)
- [ ] `artifacts` (list, create, update, delete)
- [ ] `documents` (upload, list, delete)
- [ ] `admin` (listAll, byId, updateStatus, setDepartmentStatus, audit log)

Other:
- [ ] Computed summary completion % endpoint
- [ ] Audit log writer utility

Milestone M1: All entities + endpoints functional with validation.
Dependencies: Phase 0 (tooling).

---
## Phase 2 – User Application Flow (5 Steps)
Shared:
- [ ] Multi-step container component (state + step navigation)
- [ ] Draft persistence only on explicit actions
- [ ] Progress/completion % indicator per step
- [ ] Validation integration (client + server Zod)

Step 1 Kontaktoplysninger:
- [ ] CVR/CPR, Name, Phone, Email, Commercial (Ja/Nej)
- [ ] Kontaktperson (Name, Phone)

Step 2 Eventoplysninger:
- [ ] Start/End datetime pickers
- [ ] Location selector (preset vs "egen adresse" w/ autocomplete)
- [ ] Event type tag multi-select badges
- [ ] Title, Purpose, Attendance range dropdown
- [ ] Optional PDF upload (relevant info)
- [ ] Setup/Teardown dates
- [ ] Recurring yes/no + interval dropdown

Step 3 Praktiske forhold og sikkerhed:
- [ ] Simultaneous persons dropdown
- [ ] Temporary constructions yes/no + description + certificate upload
- [ ] BR18 bilag 11 acknowledgment (radio)
- [ ] Other considerations textarea
- [ ] Arrangementsplan choice (upload vs embedded planner)
- [ ] Sound section (has sound, description, responsible name/phone)

Step 4 Tilladelser og drift:
- [ ] Blockage required yes/no + description
- [ ] Police permission yes/no + PDF upload
- [ ] Waste handling yes/no + description
- [ ] Food/drinks yes/no + description

Step 5 Summary & Submission:
- [ ] Read-only grouped summaries (Steps 1–4)
- [ ] Missing/invalid step indicators
- [ ] Percentage complete indicator (overall + step)
- [ ] Submit final (status -> submitted) + email trigger

Milestone M2: End-to-end draft → submit flow operational (without auth protection).
Dependencies: Phase 1 (API); Phase 3 (planner embed placeholder acceptable early, full later).

---
## Phase 3 – Map Grid Planner
- [ ] Static background image load based on selected location preset
- [ ] Sidebar artifact palette (stage, booth, facility, other)
- [ ] Drag & drop placement (free form, no snap)
- [ ] Artifact visual (30% opacity box + centered icon)
- [ ] Rotation handle (top-right)
- [ ] Resize handle (bottom-right)
- [ ] Info handle (top-left) opening modal
- [ ] Modal: type, size, rotation, coordinates, remove
- [ ] Persist create/update/delete via artifacts API
- [ ] Integration into Step 3.3 (when user chooses not to upload plan)

Milestone M3: Fully interactive planner with persistence.
Dependencies: Phase 1 artifact schema; Phase 2 step integration.

---
## Phase 4 – Auth & Sessions
- [ ] Nets MitID/NemID OIDC routes: `/auth/login`, `/auth/callback`, `/auth/logout`, `/auth/refresh`
- [ ] Session handling (nuxt-auth-utils) + secure cookies
- [ ] Admin AD OIDC integration under `/admin` (parallel flow) *(issuer/client TBD)*
- [ ] Shared auth utilities (state, nonce, PKCE)
- [ ] Route middleware `auth` enforcing login + role meta
- [ ] Secure existing user routes (application flow, my events)
- [ ] Admin landing page protected by role

Milestone M4: User & admin can log in/out; all routes protected.
Dependencies: Phases 0-2 (scaffold, data model, user flow).

---
## Phase 5 – Admin Workflow
- [ ] Admin dashboard (list all events, newest submitted first)
- [ ] Filter/search (basic)
- [ ] Event detail view (read + edit)
- [ ] Department assignment UI (Byliv og drift fixed + add others)
- [ ] Per-department status update (pending/in_review/approved)
- [ ] Global review status transitions (Ubehandlet → Under behandling → Delvist godkendt → Godkendt | Afvist) [Afvist terminal; requires note]
- [ ] Approve flow: upload approval PDFs (one or more)
- [ ] Reject flow: mandatory note + email trigger
- [ ] Audit log display (paginated)
- [ ] Email triggers wired to status changes

Milestone M5: Admin can process and finalize applications end-to-end.
Dependencies: Phases 1-4 (data, user flow, planner, auth), Phase 6 (email templates).

---
## Phase 6 – Submission, Emails, Documents
Documents:
- [ ] PDF upload component (<=5MB, MIME check)
- [ ] Store binary in Postgres (bytea)
- [ ] List + delete interface (respect access rules)

Emails (SendGrid):
- [ ] Submission confirmation template
- [ ] Status approved template (with attachments list summary)
- [ ] Status rejected template (includes admin note)
- [ ] Hook events to email service

User Events Page:
- [ ] “My Events” list (draft/submitted + review badges: Ubehandlet/Under behandling/Delvist godkendt/Godkendt/Afvist) with badges
- [ ] Link to resume draft editing

Milestone M6: Document handling & notifications functional.
Dependencies: Phases 1-2, 4-5 (data model, user flow, auth, admin status changes).

---
## Phase 7 – QA, Accessibility, Content Freeze
- [ ] Manual functional QA (user flow, admin flow, planner)
- [ ] Accessibility audit (keyboard, focus order, ARIA labels, contrast)
- [ ] Performance sanity (pagination on admin list, image lazy load, avoid N+1 queries)
- [ ] All strings extracted to locale (no stray literals)
- [ ] Final doc updates (README, TODO adjustments)
- [ ] Stakeholder accessibility + content sign-off

Milestone M7: Release-ready candidate build.
Dependencies: All prior feature phases complete.

---
## Phase 8 – Release Prep
- [ ] `.env.example` finalized (dev + prod variables)
- [ ] README updated with run/build instructions
- [ ] Final review meeting held (auth, privacy, UX, admin, a11y)
- [ ] Sign-off recorded

Milestone M8: v1 Release approved.
Dependencies: Phase 7 completion.

---
## Cross-Cutting Items
- [ ] Locale file coverage >= 100% of UI strings
- [ ] Error handling standardized (user-friendly messages)
- [ ] Zod schemas kept in sync with DB changes
- [ ] Audit log entries for create/update/status/document actions
- [ ] Security baseline: HTTPS (prod), CSRF/state/nonce, no secrets in logs

---
## Milestone Summary
- M0: Scaffold Ready
- M1: Data/API Complete
- M2: User Flow Submit (without auth)
- M3: Planner Integrated
- M4: Auth Operational
- M5: Admin Processing
- M6: Docs & Emails Working
- M7: QA/A11y Sign-off
- M8: Release Approved

---
## Dependency Graph (High-Level)
Phase 0 → Phase 1 (Data) → Phase 2 (User Flow) → Phase 3 (Planner)
Phase 0-2 → Phase 4 (Auth) → Phase 5 (Admin)
Phases 1-5 → Phase 6 → Phase 7 → Phase 8

---
## Open Items (to unblock tasks)
- [ ] AD OIDC issuer + client credentials
- [ ] Location preset image final paths
- [ ] SendGrid sender + template IDs
- [ ] Final approved/rejected email copy

---
## Risk Checklist
- [ ] Auth flows verified in preprod environment
- [ ] Planner interaction edge cases documented
- [ ] DB migration rollback strategy validated
- [ ] Large file rejection UX tested
- [ ] Department status conflict handling tested

---
(End of Checklist)
