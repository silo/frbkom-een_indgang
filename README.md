# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

### Local Design System (temporary)
Install the local design system until it is published:

```
pnpm add file:/Users/silo/Documents/Frederiksberg_kommune/fk_designsystem
```

Use only components and tokens from `fk_designsystem` for all UI (colors, spacing, typography).


Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start PostgreSQL database
docker compose up -d

# Run database migrations
pnpm db:push

# (Optional) Seed database with sample data
pnpm db:seed

# Run development server
pnpm dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Design & Visual References
- Use the local `fk_designsystem` for all UI components and tokens.
- Browse screenshots and icons in `docs/08-ai-context/visual-references.md` (admin views, citizen flow steps, start page, artefacts).
