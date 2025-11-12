# v1 Development TODO

Scope: Implement full v1 features as defined in /docs (no future extensions like payment, CPR encryption, GeoJSON). Environments: dev + prod. Language: da-DK only (i18n in place). Testing: manual only (no automated tests in v1). Security: baseline per guides (no cert pinning, no extra layers). Design system: `fk_designsystem` stable.

## Phases
1. Phase 0 – Project Setup
2. Phase 1 – Auth + Sessions
3. Phase 2 – Data Model + Server API
4. Phase 3 – User Application Flow (5 steps)
5. Phase 4 – Map Grid Planner
6. Phase 5 – Admin Workflow
7. Phase 6 – Submission, Emails, Documents
8. Phase 7 – QA + Accessibility + Content Freeze
9. Phase 8 – Release Prep

## High-Level Timeline (10 Weeks)
- W1: Phase 0
- W2: Phase 1
- W3–W4: Phase 2
- W5–W6: Phase 3
- W7: Phase 4
- W8: Phase 5
- W9: Phase 6
- W10: Phase 7–8 + buffer

## Phase Tasks
### Phase 0 – Project Setup
- Init Nuxt 4 project structures, ESLint flat config, Prettier
- Install `fk_designsystem` locally
- Configure TypeScript strict settings
- Add base layouts (default, admin)
- Setup locale folder and da-DK messages
- Integrate tokens/colors from design system

### Phase 1 – Auth + Sessions
- Implement Nets MitID/NemID (routes: login, callback, logout, refresh) per docs
- Implement admin AD OIDC under `/admin` route (parallel structure)
- Add session middleware `auth` + role checks
- Public pages: index, dashboard; admin landing page

### Phase 2 – Data Model + Server API
- Drizzle schemas for all entities (users, departments, event_application, artifacts, documents, sound/waste/food/safety/access info tables, status history, department status, audit log, type tags, location presets)
- Migrations & seeds (departments, type tags, location presets)
- Zod input schemas
- tRPC routers: users, events, artifacts, documents, admin

### Phase 3 – User Application Flow
- 5-step multi-step form pages/components
- Step 1 Kontaktoplysninger (1.1 + 1.2)
- Step 2 Eventoplysninger (2.1–2.5) + tag badges + PDF upload
- Step 3 Praktiske forhold og sikkerhed (3.1–3.4) conditional blocks, planner embed
- Step 4 Tilladelser og drift (4.1–4.2) conditional blocks + uploads
- Step 5 Summary: completion %, errors, confirm submission
- Draft save & explicit persistence only on “Next” / “Save as Draft”
- Locale-based text; design system components

### Phase 4 – Map Grid Planner
- Component per MAP_GRID_PLANNER.md with static background selection
- Sidebar artifact list (stage, booth, facility, other)
- Drag/drop free positioning (no grid snap)
- Artifact box style (30% opacity, centered icon)
- Resize handle (bottom-right), rotation handle (top-right), info modal handle (top-left)
- Edit modal (type, size, rotation, coordinates, remove)
- Persist create/update/delete via artifacts API

### Phase 5 – Admin Workflow
- Admin dashboard listing all events (submitted first)
- Event detail + edit capabilities
- Multi-department assignment & status (Byliv og drift default, Klima og miljø, Byggeri og arkitektur)
- Global review status transitions (Ubehandlet→Under behandling→Delvist godkendt→Godkendt | Afvist)
- Reject requires note (email sent)
- Approve allows PDF approval uploads
- Audit log entries for actions

### Phase 6 – Submission, Emails, Documents
- PDF upload UI (size/type validation, <=5MB, bytea storage)
- SendGrid integration (submission confirmation, decision notifications)
- User “My Events” page (draft/submitted + review badges: Ubehandlet/Under behandling/Delvist godkendt/Godkendt/Afvist)

### Phase 7 – QA + Accessibility + Content Freeze
- Manual QA against all flows
- Accessibility audit (labels, focus order, contrast, keyboard
  navigation)
- Performance sanity (paginate admin list, lazy image load)
- Ensure all strings are in locale file
- Final documentation updates where needed

### Phase 8 – Release Prep
- Update `.env.example` (dev/prod variables)
- README minimal instructions (install, dev, build)
- Stakeholder review sign-offs (auth, data/privacy, UX, admin workflow, final accessibility)

## Dependencies and Sequence
- Phase 1 depends on Phase 0 setup
- Phase 2 depends on Phase 0 (env + tooling); informs Phases 3–6
- Phase 3 requires auth (Phase 1) + API (Phase 2)
- Phase 4 requires event + artifact schema (Phase 2) and integration point in Step 3
- Phase 5 requires Phase 2 APIs + existing user submissions (Phase 3)
- Phase 6 builds on event submission (Phase 3) + admin decisions (Phase 5)
- Phase 7 runs after all feature phases complete (0–6)
- Phase 8 finalizes after QA (Phase 7)

## Acceptance Criteria (Summary)
- Users & admins authenticate (MitID & AD OIDC) and sessions enforced
- Full data model operational with tRPC endpoints and validation
- 5-step form matches doc spec with conditional logic & summary gating
- Planner supports create/move/resize/rotate/edit/remove artifacts with persistence
- Admin flow supports department statuses, global status change with required note/approval PDFs
- Emails sent on submission and status change
- All strings localized (da-DK), design system exclusively used
- Accessibility baseline met (WCAG 2.1 AA essentials)

## Risks & Mitigations
- OIDC complexity → Follow implementation guide strictly; early integration test
- Planner interaction edge cases → Scope locked to described features; defer enhancements
- Data integrity across multi-step form → Central Zod schemas; disable submit until complete
- Large PDF storage → Enforce size & MIME checks early; DB indexing
- Department status confusion → Clear UI segmentation; unique constraints + transactional updates

## Stakeholder Review Gates
- End W2: Auth demo
- End W4: Data/API + privacy review
- Mid W6: User flow + planner UX review
- End W8: Admin workflow review
- End W9: Accessibility & content sign-off
- W10: Final release approval

## Open Questions
- AD OIDC issuer/client details
- Location preset image paths finalization
- SendGrid sender + template IDs
- Final email copy for approved/rejected (user-facing wording)

-- End of v1 TODO --
