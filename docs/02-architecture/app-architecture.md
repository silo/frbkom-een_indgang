---
title: Arkitektur / Architecture Patterns
slug: architecture-patterns
version: 1.0.0
status: stable
lastUpdated: 2025-11-10
audience: [developers, ai]
owners: [platform-team]
tags: [architecture, nuxt, stack]
summary: Overview of application architecture, directory structure, and preferred technology stack.
i18n:
  defaultLocale: da-DK
  keysNamespace: docs.architecture.patterns
---

# Architecture Patterns

## Application Architecture

- **Pattern**: Full-stack Nuxt 4 with server-side rendering (SSR)
- **State Management**: Pinia stores for reactive application state
- **API Layer**: tRPC for end-to-end type-safe API communication
- **Data Validation**: Zod schemas for runtime validation across client and server
- **Authentication**: Better-auth with MitID integration via Nets eID Broker

## Directory Structure (Nuxt 4)

```
app/
├── assets/           # Uncompiled assets (CSS/SCSS, fonts, images)
├── components/       # Vue components (auto-imported)
├── composables/      # Reusable composition functions (auto-imported)
├── layouts/          # Application layouts (default, admin, etc.)
├── middleware/       # Route guards and navigation middleware
├── pages/            # Vue pages (file-based routing)
├── plugins/          # Vue/Nuxt plugins
├── utils/            # Utility functions (auto-imported)
├── app.config.ts     # Runtime app configuration
├── app.vue           # Root component
└── error.vue         # Global error page

server/
├── api/              # API route handlers (tRPC procedures)
├── middleware/       # Server-side middleware
├── plugins/          # Server plugins
└── utils/            # Server-side utilities

shared/               # Code shared between client and server
├── schemas/          # Zod validation schemas
└── types/            # Shared TypeScript types

public/               # Static files (served at root)
├── images/
└── favicon.ico

modules/              # Custom Nuxt modules
```

## Key Dependencies

- **Nuxt 4**: Meta-framework for Vue 3 applications
- **Vue 3**: Progressive JavaScript framework
- **Pinia**: State management library
- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **Better-auth**: Authentication library with MitID support
- **tRPC**: Type-safe API layer
- **Zod**: Schema validation library
- **VueUse**: Collection of Vue composition utilities
- **SendGrid**: Email service provider
- **Vue I18n**: Internationalization plugin for multi-language support

## Preferred Libraries and Tools

### Core Stack

- **Framework**: Nuxt 4 (with Vue 3 Composition API)
- **Language**: TypeScript (strict mode)
- **State Management**: Pinia
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Authentication**: Better-auth (with MitID via Nets eID Broker)
- **API Layer**: tRPC (type-safe client-server communication)

### UI & Interaction

- **Map Visualization**: Custom Vue 3 grid planner with static image backgrounds (hidden for custom address; requires uploaded plan PDF)
- **Drag & Drop**: Native HTML5 Drag and Drop API or VueUse composables
- **Styling**: Custom CSS/SCSS (no CSS frameworks specified)
- **Form Utilities**: VueUse
- **Icons**: (Specify your icon library if using one)

### Development Tools

- **Testing**: Vitest (unit tests), Vue Test Utils (component tests)
- **Linting**: ESLint
- **Formatting**: Prettier
- **Version Control**: Git, GitHub
- **CI/CD**: GitHub Actions
- **Containerization**: Docker

### External Services

- **Email**: SendGrid (transactional emails)
- **Authentication Provider**: Nets eID Broker (MitID)

### Utilities

- **Environment Variables**: dotenv
- **HTTP Client**: Native `fetch` or `$fetch` (Nuxt's wrapper)
- **Internationalization**: Vue I18n (default: Danish, multi-language support)
- **Date Formatting**: Custom utility with Danish format (dd/MM-YYYY - HH:mm)
- **Currency Formatting**: DKK format (20.000,00)
- **File Uploads**: Using PostgreSQL to store files
