# Docker Database Commands

## Quick Reference

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# Stop and remove all data
docker compose down -v

# View logs
docker compose logs -f postgres

# Check status
docker compose ps

# Access PostgreSQL CLI
docker compose exec postgres psql -U postgres -d frbkom_een_indgang
```

## Database Management

### Start Database
```bash
docker compose up -d
```

### Stop Database (keeps data)
```bash
docker compose down
```

### Stop and Remove All Data
```bash
# WARNING: This will delete all data in the database
docker compose down -v
```

### View Logs
```bash
# Follow logs in real-time
docker compose logs -f postgres

# View last 100 lines
docker compose logs --tail=100 postgres
```

### Check Container Status
```bash
docker compose ps
```

### Access PostgreSQL CLI
```bash
# Connect to database
docker compose exec postgres psql -U postgres -d frbkom_een_indgang

# Once connected, useful commands:
# \dt              - List all tables
# \d table_name    - Describe table
# \q               - Quit
```

## Troubleshooting

### Port Already in Use
If you get "port is already allocated" error:

```bash
# Find what's using port 5432
lsof -i :5432

# Stop old container
docker stop $(docker ps -q --filter "publish=5432")

# Or stop all postgres containers
docker ps -a | grep postgres | awk '{print $1}' | xargs docker stop

# Then start fresh
docker compose up -d
```

### Container Won't Start
```bash
# Check logs for errors
docker compose logs postgres

# Remove and recreate container
docker compose down
docker compose up -d
```

### Reset Database Completely
```bash
# Stop and remove everything
docker compose down -v

# Start fresh
docker compose up -d

# Push schema
pnpm db:push

# Seed data
pnpm db:seed
```

### Check Database Connection
```bash
# Test connection
docker compose exec postgres pg_isready -U postgres

# Should output: /var/run/postgresql:5432 - accepting connections
```

## Database Backup & Restore

### Backup Database
```bash
# Create backup
docker compose exec -T postgres pg_dump -U postgres frbkom_een_indgang > backup.sql

# With timestamp
docker compose exec -T postgres pg_dump -U postgres frbkom_een_indgang > backup-$(date +%Y%m%d-%H%M%S).sql
```

### Restore Database
```bash
# Drop existing database and recreate
docker compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS frbkom_een_indgang;"
docker compose exec postgres psql -U postgres -c "CREATE DATABASE frbkom_een_indgang;"

# Restore from backup
docker compose exec -T postgres psql -U postgres frbkom_een_indgang < backup.sql
```

## Environment Variables

The database configuration is in `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/frbkom_een_indgang
```

To use a different password or database name, update both:
1. `.env` file - DATABASE_URL
2. `docker-compose.yml` - POSTGRES_* environment variables

## Integration with Drizzle

```bash
# Generate migration from schema changes
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Run migrations (production)
pnpm db:migrate

# Seed database with sample data
pnpm db:seed

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## Development Workflow

1. **First time setup**:
   ```bash
   docker compose up -d
   pnpm db:push
   pnpm db:seed
   pnpm dev
   ```

2. **Daily development**:
   ```bash
   # Check if database is running
   docker compose ps
   
   # If not running, start it
   docker compose up -d
   
   # Start dev server
   pnpm dev
   ```

3. **After schema changes**:
   ```bash
   pnpm db:push  # Push new schema
   pnpm dev      # Restart if needed
   ```

4. **End of day**:
   ```bash
   # Optional: stop database to free resources
   docker compose down
   ```

## Docker Compose Configuration

The `docker-compose.yml` file contains:

- **Image**: `postgres:16-alpine` (lightweight PostgreSQL 16)
- **Container Name**: `frbkom-postgres`
- **Restart Policy**: `unless-stopped` (auto-restart except manual stops)
- **Environment**:
  - User: `postgres`
  - Password: `postgres`
  - Database: `frbkom_een_indgang`
- **Ports**: `5432:5432` (host:container)
- **Volume**: `postgres_data` (persistent data storage)
- **Health Check**: Monitors database readiness

## Resources

- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
