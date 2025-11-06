# Database Migrations

PostgreSQL schema migrations managed with Prisma Migrate.

## Structure
- `001_initial_schema.sql` - Users, threads, posts tables
- `002_metrics_tables.sql` - Benchmark and metrics tables (Phase 2)

## Running Migrations

```bash
# Generate migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```
