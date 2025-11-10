# AGENTS.md – Repo Guide for Coding Agents

## Commands
- Install: `pnpm install`; Dev: `pnpm dev`; Build: `pnpm build`
- Lint: `pnpm exec eslint .` | Fix: `pnpm exec eslint . --fix`
- Test (Vitest via @nuxt/test-utils): `npx vitest`
- Single test: `npx vitest run path/to/test.spec.ts -t "case"`

## Code Style
- Language: TypeScript, Vue 3 + Nuxt 4; use `<script setup lang="ts">`
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
- Notes: Based on `docs/code-style.md` and `docs/best-practices.md`; no Cursor/Copilot rules detected; include if added later