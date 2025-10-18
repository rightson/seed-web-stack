# Database Setup Guide

## Quick Start

Your database is already initialized! Just run:

```bash
npm run dev
```

The database connection is verified automatically when the GraphQL API is first accessed.

## Database Commands

### Development
- `npm run dev` - Start development server

### Database Management
- `npm run db:migrate` - Create/apply migrations after schema changes
- `npm run db:reset` - Reset database (⚠️ deletes all data)
- `npm run db:studio` - Open Prisma Studio (visual DB browser)

## When to Initialize Database

### First Time Setup
If you're setting up the project fresh:

```bash
# 1. Install dependencies
npm install

# 2. Create database and run migrations
npm run db:migrate

# 3. Start development
npm run dev
```

### After Pulling Schema Changes
If someone updated `prisma/schema.prisma`:

```bash
npm run db:migrate
```

### If Database Gets Corrupted
```bash
# Reset and recreate from scratch
npm run db:reset
```

## Database File Location

- **Database**: `prisma/dev.db` (SQLite file)
- **Migrations**: `prisma/migrations/`
- **Schema**: `prisma/schema.prisma`

## Environment Variables

The `.env` file contains:
```
DATABASE_URL="file:/Users/rightson/workspace/seed-web-stack/prisma/dev.db"
JWT_SECRET="your-secret-key-change-in-production"
```

**Note**: Uses absolute path to work from both root and `apps/web` directories.

### Switching to PostgreSQL

To use PostgreSQL instead of SQLite:

1. **Update `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

2. **Update `.env` with PostgreSQL connection string:**
```bash
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/myapp_dev"

# Remote PostgreSQL (Railway, Render, etc.)
DATABASE_URL="postgresql://user:password@host.railway.app:5432/railway"

# Supabase
DATABASE_URL="postgresql://postgres:password@db.projectref.supabase.co:5432/postgres"

# With SSL (production)
DATABASE_URL="postgresql://user:pass@prod.example.com:5432/db?sslmode=require"

# With connection pooling
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20"
```

3. **Run migrations:**
```bash
npm run db:migrate
```

#### PostgreSQL Connection String Format
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?options
```

**Common options:**
- `sslmode=require` - Force SSL connection
- `connection_limit=10` - Max connection pool size
- `pool_timeout=20` - Connection timeout in seconds
- `schema=public` - Default schema to use

## Database Verification

The database connection is automatically verified when the GraphQL API route loads. In the server logs you'll see:

```
🔍 Verifying database connection...
✅ Database connection successful
```

This happens on the first GraphQL request (lazy loading). If you see ❌, run `npm run db:migrate` to fix it.
