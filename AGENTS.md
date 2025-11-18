# AGENTS.md – Repo Guide for Coding Agents

## Intro
This repository is a Nuxt 4 (Vue 3 + TypeScript) app implementing Frederiksberg Kommune’s “Én indgang” event application flow. Development guidance, tasks, and references live under `docs/` with a single consolidated entry point at `docs/development/ALL_DEVELOPMENT.md`.

## Architecture
- App architecture: `docs/02-architecture/app-architecture.md`
- Data model: `docs/02-architecture/data-model.md`
- User flow (citizen): `docs/05-flows/user-flow-and-form-steps.md`
- Admin flow: `docs/05-flows/admin-flow.md`
- Auth (Nets eID/MitID) guide: `docs/04-authentication/nets-eid/implementation-guide.md`
- Map grid planner spec: `MAP_GRID_PLANNER.md`

## Development Plan
- All-in-one development hub: `docs/development/ALL_DEVELOPMENT.md`
- Phases and milestone checklist: `docs/development/CHECKLIST.md`
- Phase task checklists: `docs/development/tasks/`
  - Phase 0 → `docs/development/tasks/PHASE_0.md` (Project Setup)
  - Phase 1 → `docs/development/tasks/PHASE_1.md` (Data Model & API)
  - Phase 2 → `docs/development/tasks/PHASE_2.md` (User Application Flow, includes visual refs)
  - Phase 4 → `docs/development/tasks/PHASE_4.md` (Auth & Sessions)
  - Phase 5 → `docs/development/tasks/PHASE_5.md` (Admin Workflow, admin refs)
  - Phase 6 → `docs/development/tasks/PHASE_6.md` (Submission, Emails, Documents)
  - Phase 7 → `docs/development/tasks/PHASE_7.md` (QA & Accessibility)
  - Phase 8 → `docs/development/tasks/PHASE_8.md` (Release Prep)
  - Phase 3 (deferred) → `docs/development/tasks/PHASE_3.md` (Map Grid Planner; execute after Phase 8 once customer feedback lands)
- Cross-cutting: `docs/development/tasks/CROSS_CUTTING.md`
- Open items (blocking): `docs/development/tasks/OPEN_ITEMS.md`
- Risks: `docs/development/tasks/RISKS.md`

## Commands
- Install: `pnpm install`; Dev: `pnpm dev`; Build: `pnpm build`
- Lint: `pnpm exec eslint .` | Fix: `pnpm exec eslint . --fix`
- Test (Vitest via @nuxt/test-utils): `npx vitest`
- Single test: `npx vitest run path/to/test.spec.ts -t "case"`

## Code Style
- Language: TypeScript, Vue 3 + Nuxt 4; use `<script setup lang="ts">`
- **CRITICAL: English-only naming** - NEVER use Danish in file names, functions, variables, routes, or class names. Danish ONLY in `app/locales/*.json`. See `docs/03-standards/naming-conventions.md`
- Imports: Use Nuxt auto-imports for components/composables; import utilities explicitly
- Formatting: Follow ESLint (flat) rules; keep code consistent and deterministic
- Types: Explicit types for public APIs; avoid `any`; use utility types; prefer `const`
- Naming: camelCase vars/functions, PascalCase classes/components, UPPER_SNAKE_CASE constants, kebab-case files
- Components: Single responsibility, keep <200 lines; `defineProps`/`defineEmits`; prefer computed over methods
- State: `ref` for primitives, `reactive` for objects; extract logic to composables
- Error handling: try/catch with actionable messages; never swallow; return user-friendly server errors
- Validation: Validate all user inputs (Zod per docs); no raw SQL (use ORM if applicable)
- Security: Never commit secrets; use env vars; follow OWASP; sanitize output
- Accessibility: Meet WCAG 2.1 AA; ensure responsive design
- i18n: Default da-DK; date `dd/MM-YYYY - HH:mm`; currency DKK
- Design System: Always use components, tokens, colors from local fk_designsystem. Install via `pnpm add file:/Users/silo/Documents/Frederiksberg_kommune/fk_designsystem` until published.
- Notes: Based on `docs/03-standards/code-style.md`, `docs/03-standards/naming-conventions.md`, and `docs/03-standards/best-practices.md`

## Environments & Config
- Environments: `dev` and `prod`
- Env vars: `./.env.example`
- Nuxt config: `nuxt.config.ts`
- TypeScript config: `tsconfig.json`
- ESLint config: `eslint.config.mjs`

## Design System & Tokens
- Install design system locally: `pnpm add file:/Users/silo/Documents/Frederiksberg_kommune/fk_designsystem`
- Tokens: `docs/color.Mode 1.tokens.json`, `docs/primitive.Value.tokens.json`

## Visual References
- Indexed UI imagery: `docs/08-ai-context/visual-references.md`
- Image assets: `docs/Images/`
- Phase-specific references embedded in:
  - Citizen flow: `docs/development/tasks/PHASE_3.md`
  - Planner: `docs/development/tasks/PHASE_4.md`
  - Admin: `docs/development/tasks/PHASE_5.md`

## Security & Accessibility
- Security baseline only (no cert pinning/CPR encryption for v1); never commit secrets; sanitize output
- Accessibility target: WCAG 2.1 AA compliance

## Where to Start
1. Read `docs/development/ALL_DEVELOPMENT.md`
2. Follow Phase 0 tasks in `docs/development/tasks/PHASE_0.md`
3. Keep `OPEN_ITEMS.md` and `RISKS.md` up to date during implementation
