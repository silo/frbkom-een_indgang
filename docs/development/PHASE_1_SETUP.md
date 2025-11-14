# Phase 1 - Database Setup Guide

This guide covers setting up the database and running migrations/seeds for Phase 1.

## Prerequisites

- PostgreSQL installed and running
- Database created: `frbkom_een_indgang`
- Environment variables configured

## Setup Steps

### 1. Configure Environment

Copy `.env.example` to `.env` and update DATABASE_URL:

```bash
cp .env.example .env
```

Update the DATABASE_URL in `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/frbkom_een-indgang
```

### 2. Create Database

```bash
# Using psql
psql -U postgres
CREATE DATABASE frbkom_een_indgang;
\q
```

### 3. Apply Migrations

Push the schema to the database:

```bash
pnpm db:push
```

Or run migrations:

```bash
pnpm db:migrate
```

### 4. Seed Data

Run the seed script to populate initial data:

```bash
pnpm db:seed
```

This will create:
- **Departments**: Byliv og Drift, Klima og Miljø, Byggeri og Arkitektur
- **Event Type Tags**: festival, market, concert, sports, cultural, demonstration, parade, other
- **Location Presets**: Frederiksberg Have, Søndermarken, Gl. Carlsberg Vej, Falkoner Allé

## Database Schema

### Core Tables

- `user` - User authentication and profiles (MitID integration)
- `event_application` - Main event entity with status workflow
- `event_artifact` - Map planner artifacts (stage, booth, facility, etc.)
- `event_document` - PDF documents stored as base64

### Event Info Tables (1:1 with events)

- `event_sound_info` - Sound equipment and noise details
- `event_waste_info` - Waste management plans
- `event_food_info` - Food/beverage service details
- `event_safety_info` - Safety plans and BR18 compliance
- `event_access_info` - Road blockages and access plans

### Administrative Tables

- `department` - Municipal departments handling review
- `department_event_status` - Per-department review status
- `event_type_tag` - Event categorization tags
- `event_type_tag_link` - Many-to-many event-tag relationships
- `location_preset` - Predefined event locations
- `event_status_history` - Status change tracking
- `event_audit_log` - Comprehensive audit trail

## Available Scripts

```bash
# Generate new migration from schema changes
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Run migrations (production)
pnpm db:migrate

# Seed database with initial data
pnpm db:seed
```

## Verification

After setup, verify the database:

```bash
# Connect to database
psql postgresql://user:password@localhost:5432/frbkom_een_indgang

# List tables
\dt

# Check departments
SELECT * FROM department;

# Check event type tags
SELECT * FROM event_type_tag;

# Check location presets
SELECT * FROM location_preset;
```

## Next Steps

1. **Test tRPC Endpoints** - Verify all API routes work with the database
2. **Phase 2** - Implement user application flow UI
3. **Phase 3 (deferred)** - Map grid planner interface (run after Phase 8 when customer feedback arrives)
4. **Phase 4** - Integrate MitID authentication

## Troubleshooting

### Connection Issues

If you get connection errors:
1. Verify PostgreSQL is running: `pg_isready`
2. Check DATABASE_URL format
3. Ensure database exists: `psql -l | grep frbkom`

### Migration Issues

If migrations fail:
1. Check schema syntax: `pnpm db:generate`
2. Verify database permissions
3. Clear migrations and regenerate if needed

### Seed Issues

If seed fails:
1. Ensure migrations are applied first
2. Check for duplicate data (seeds are not idempotent)
3. Clear tables and re-seed if needed
