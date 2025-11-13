# Development Reference – All-in-One

This document centralizes all development instructions, tasks, checklists, risks, and visual references for v1.

## Commands
- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm exec eslint .`
- Lint fix: `pnpm exec eslint . --fix`
- Tests (Vitest): `npx vitest`

## Phase Overview
See the full checklist in `./CHECKLIST.md` and detailed tasks under `./tasks/`.
- Phase 0 – Project Setup → `./tasks/PHASE_0.md`
- Phase 1 – Data Model & API → `./tasks/PHASE_1.md`
- Phase 2 – User Application Flow → `./tasks/PHASE_2.md`
- Phase 3 – Map Grid Planner → `./tasks/PHASE_3.md`
- Phase 4 – Auth & Sessions → `./tasks/PHASE_4.md`
- Phase 5 – Admin Workflow → `./tasks/PHASE_5.md`
- Phase 6 – Submission, Emails, Documents → `./tasks/PHASE_6.md`
- Phase 7 – QA & Accessibility → `./tasks/PHASE_7.md`
- Phase 8 – Release Prep → `./tasks/PHASE_8.md`

Cross-cutting → `./tasks/CROSS_CUTTING.md`
Open items → `./tasks/OPEN_ITEMS.md`
Risks → `./tasks/RISKS.md`

## Visual References
Use `docs/08-ai-context/visual-references.md` for an indexed list of screenshots and icons.
Key paths referenced in tasks:
- Kontaktoplysninger: `docs/Images/flow/kontaktoplysninger.png`, `docs/Images/flow/kontaktoplysninger/fejl.png`
- Eventoplysninger: `docs/Images/flow/eventoplysninger/tom.png`, `docs/Images/flow/eventoplysninger/udfyldt.png`
- Praktiske forhold og sikkerhed: `docs/Images/flow/praktiske-forhold-og-sikkerhed/tom.png`, `udfyldt.png`, `fejl.png`, banner `Info banner.png`, icons `Construction Site 1.svg`, `Coat of Arms.png`
- Tilladelser og drift: `docs/Images/flow/tilladelser-og-drift/tom.png`, `udfyldt.png`
- Opsummering & bekræftelse: `docs/Images/flow/opsummering-og-bekræftelse.png`, `opsummering-og-bekræftelse/fejl.png`, `flow/bekræftelse.png`
- Admin: `docs/Images/admin/overblik.png`, `docs/Images/admin/detaljeside.png`, `docs/Images/admin/detaljeside/godkend-ansøgning.png`

## Architecture & Standards
- App architecture: `docs/02-architecture/app-architecture.md`
- Data model: `docs/02-architecture/data-model.md`
- Code style: `docs/03-standards/code-style.md`
- Best practices: `docs/03-standards/best-practices.md`
- Auth guide (Nets eID): `docs/04-authentication/nets-eid/implementation-guide.md`
- User/Admin flows: `docs/05-flows/user-flow-and-form-steps.md`, `docs/05-flows/admin-flow.md`
- Map planner spec: `MAP_GRID_PLANNER.md`

## Token & Design System
- Install design system: `pnpm add file:/Users/silo/Documents/Frederiksberg_kommune/fk_designsystem`
- Tokens: `docs/color.Mode 1.tokens.json`, `docs/primitive.Value.tokens.json`

## Environment & Config
- `.env.example` documents required env vars
- `nuxt.config.ts`, `eslint.config.mjs`, `tsconfig.json` provide tooling config

## Milestones & Dependencies
Summaries and dependency graph are in `./CHECKLIST.md` under “Milestone Summary” and “Dependency Graph”.

## How to Work with Tasks
- Update checkboxes in `docs/development/tasks/*.md` as you progress
- Keep `OPEN_ITEMS.md` and `RISKS.md` current
- If adding/renaming images, update `docs/08-ai-context/visual-references.md`

## Notes
- i18n default: da-DK
- Dates: `dd/MM-YYYY - HH:mm`; Currency: DKK
- Accessibility: WCAG 2.1 AA
- Security baseline only; never commit secrets

If anything is unclear or needs changes, ping here first.
