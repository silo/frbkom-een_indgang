---
title: Kodestandard / Code Style and Conventions
slug: code-style
version: 1.0.0
status: stable
lastUpdated: 2025-11-10
audience: [developers, ai]
owners: [platform-team]
tags: [style, lint, typescript, vue]
summary: Coding conventions and review checklist for Nuxt 4 + Vue 3 with TypeScript.
i18n:
  defaultLocale: da-DK
  keysNamespace: docs.standards.codeStyle
---

# Code Style and Conventions

## General Guidelines

- Follow industry best practices for clean, maintainable code
- Write self-documenting code with clear variable and function names
- Keep functions small and focused on a single responsibility
- Use meaningful comments for complex logic

## Naming Conventions

- **Variables**: Use camelCase (e.g., `userName`, `totalCount`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`, `API_URL`)
- **Functions**: Use camelCase with verb prefixes (e.g., `getUserData`, `calculateTotal`)
- **Classes**: Use PascalCase (e.g., `UserProfile`, `EventManager`)
- **Files**: Use kebab-case for file names (e.g., `user-profile.ts`, `event-manager.js`)

## Language-Specific Guidelines

### TypeScript (Primary Language)

- **Always use TypeScript** for type safety and better code quality
- Prefer `const` over `let`, never use `var`
- Use arrow functions for callbacks and inline functions
- Use template literals for string interpolation
- Always define explicit types/interfaces for function parameters and return values
- Prefer async/await over promise chains
- Use proper TypeScript utility types (Partial, Pick, Omit, etc.)
- Leverage type inference where appropriate, but be explicit for public APIs

### Vue 3 / Nuxt 4

- Use Composition API with `<script setup>` syntax
- Define component props with TypeScript interfaces
- Use `defineProps()` and `defineEmits()` for type-safe components
- Keep components single-responsibility and under 200 lines
- Extract complex logic into composables
- Use auto-imports for components and composables (no manual imports needed)
- Prefer computed properties over methods for derived state
- Use `ref()` for primitive values, `reactive()` for objects

## Git Commit Guidelines

- Use conventional commits format: `type(scope): message`
- Types: feat, fix, docs, style, refactor, test, chore
- Keep commits atomic and focused
- Write clear, descriptive commit messages

## Code Review Checklist

Before suggesting code, ensure:

- [ ] Code follows Nuxt 4 and Vue 3 Composition API best practices
- [ ] TypeScript types are properly defined (no `any` types)
- [ ] Components use `<script setup lang="ts">` syntax
- [ ] All user inputs are validated with Zod schemas
- [ ] Proper error handling is implemented with meaningful messages
- [ ] No hardcoded values (use environment variables or constants)
- [ ] Code is formatted with Prettier and passes ESLint checks
- [ ] Database queries use Drizzle ORM (no raw SQL with user input)
- [ ] Authentication and authorization checks are in place
- [ ] API routes follow tRPC patterns and conventions
- [ ] Components are under 200 lines and single-responsibility
- [ ] Reusable logic is extracted into composables
- [ ] Tests are written for critical functionality
- [ ] Performance considerations are addressed (pagination, lazy loading)
- [ ] Accessibility guidelines are followed (WCAG 2.1)
- [ ] Documentation is updated (comments, README, API docs)
- [ ] No security vulnerabilities introduced
- [ ] No secrets or sensitive data in code
- [ ] Responsive design works on various screen sizes
- [ ] Email templates are tested (if applicable)
