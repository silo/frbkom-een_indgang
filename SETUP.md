# Development Setup Guide

## Prerequisites

- Node.js 22.x or later
- pnpm 9.x or later
- PostgreSQL 16.x or later

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

For local development, the `.env.development` file is already configured with Docker PostgreSQL settings.

Alternatively, you can create your own `.env` file:

```bash
cp .env.example .env
```

**Important**: Nuxt requires the `NUXT_` prefix for runtime config variables. The key environment variable for database connection is:

```bash
NUXT_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/frbkom_een_indgang
```

### 3. Set Up PostgreSQL Database

#### Option A: Using Docker Compose (Recommended)

```bash
# Start PostgreSQL container
docker compose up -d

# Check if it's running
docker compose ps

# View logs
docker compose logs postgres

# Stop database
docker compose down

# Stop and remove data
docker compose down -v
```

The database will be automatically created with:
- **User**: postgres
- **Password**: postgres
- **Database**: frbkom_een_indgang
- **Port**: 5432

#### Option B: Using Docker CLI

```bash
# Run PostgreSQL in Docker
docker run -d \
  --name frbkom-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=frbkom_een_indgang \
  -p 5432:5432 \
  postgres:16-alpine

# Check if it's running
docker ps
```

#### Option C: Using Homebrew (macOS)

```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Create the database
createdb frbkom_een_indgang
```

#### Option D: Using Postgres.app (macOS)

1. Download from https://postgresapp.com/
2. Install and start Postgres.app
3. Open psql and run:
   ```sql
   CREATE DATABASE frbkom_een_indgang;
   ```

### 4. Update DATABASE_URL

Edit `.env` file and ensure DATABASE_URL matches your PostgreSQL setup:

```bash
# Default (if using postgres/postgres credentials)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/frbkom_een_indgang

# Or with custom credentials
DATABASE_URL=postgresql://username:password@localhost:5432/frbkom_een_indgang
```

### 5. Run Database Migrations

```bash
# Generate migration (if schema changed)
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Seed database with sample data
pnpm db:seed
```

### 6. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000` (or next available port).

## Development Workflow

### Running the App

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
```

### Code Quality

```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm typecheck        # Run TypeScript type checking
```

### Testing

```bash
pnpm test             # Run tests with Vitest
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
```

### Database Operations

```bash
pnpm db:generate      # Generate migration from schema changes
pnpm db:push          # Push schema to database (dev only)
pnpm db:migrate       # Run migrations (production)
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Drizzle Studio (database GUI)
```

## Troubleshooting

### Port Already in Use

If you see "Port 3000 is already in use", Nuxt will automatically use the next available port (3001, 3002, etc.).

To kill the process using port 3000:

```bash
lsof -ti:3000 | xargs kill -9
```

### Database Connection Errors

1. **"DATABASE_URL is not configured"**
   - Ensure `.env` file exists and contains DATABASE_URL
   - Restart the dev server after creating `.env`

2. **"Connection refused"**
   - Check if PostgreSQL is running: `docker compose ps` or `docker ps`
   - Start PostgreSQL: `docker compose up -d`

3. **"Database does not exist"**
   - Create the database: `createdb frbkom_een_indgang`

4. **"Authentication failed"**
   - Check username/password in DATABASE_URL
   - Default PostgreSQL user is usually `postgres` with no password on macOS

### WebSocket Errors

If you see WebSocket errors, it's usually from a previous dev server still running:

```bash
# Kill all node processes
pkill -9 node

# Or restart the dev server
pnpm dev
```

## Development Without Database

The app will start without a database connection, but database-dependent features won't work. This is useful for:

- Working on UI components
- Testing routing and navigation
- Developing client-side logic

You'll see warnings in the console, but the app will function for basic testing.

## Environment Variables Reference

See `.env.example` for all available environment variables and their descriptions.

### Required for Development

- `DATABASE_URL` - PostgreSQL connection string
- `NUXT_SESSION_PASSWORD` - Session encryption key (min 32 characters)

### Optional for Development

- `ENABLE_DEV_AUTH=true` - Bypass authentication in development
- `NUXT_PUBLIC_NETS_*` - Only needed for testing MitID authentication
- `SENDGRID_*` - Only needed for testing email functionality

## Next Steps

1. ✅ Install dependencies (`pnpm install`)
2. ✅ Set up `.env` file (already created)
3. ⏳ Start PostgreSQL with Docker (`docker compose up -d`)
4. ⏳ Run database migrations (`pnpm db:push`)
5. ⏳ Seed database (`pnpm db:seed`)
6. ✅ Start development server (`pnpm dev`)
7. 🎉 Start coding!

For more information, see:
- [Architecture Documentation](docs/02-architecture/app-architecture.md)
- [Development Plan](docs/development/ALL_DEVELOPMENT.md)
- [Phase Checklists](docs/development/CHECKLIST.md)
