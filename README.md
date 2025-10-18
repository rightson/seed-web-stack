# Seed Web Stack

> Production-ready full-stack monorepo with Next.js 15, GraphQL, Relay, and Prisma

A modern web application starter featuring type-safe end-to-end development, GraphQL API with optimized client-side caching, and built-in authentication—all within a smart monorepo architecture.

## Features

- 🚀 **Next.js 15** with App Router and React Server Components
- 🔐 **Built-in Authentication** - JWT-based auth with bcrypt password hashing
- 📊 **GraphQL API** - Type-safe API with Yoga server and Relay client
- 🗄️ **Prisma ORM** - Type-safe database access with migrations
- 🎨 **Tailwind CSS v4** - Modern utility-first styling
- 📦 **Nx Monorepo** - Smart build system with caching
- 🔒 **TypeScript** - Full type safety across frontend and backend
- ⚡ **Optimized Performance** - Relay's intelligent query batching and caching

## Quick Start

```bash
# Clone and install dependencies
git clone https://github.com/rightson/seed-web-stack
cd seed-web-stack
npm install

# Configure environment
cat > .env << EOF
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/myapp"
JWT_SECRET="your-secret-key-change-in-production"
EOF

# Setup database and start development
npx prisma migrate dev
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

> **Note:** Relay compiler runs automatically via Nx when GraphQL files change. For SQLite, use `DATABASE_URL="file:./dev.db"` instead.

## Project Structure

```
seed-web-stack/
├── apps/
│   ├── web/                           # Next.js application
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── graphql/route.ts  # GraphQL API endpoint
│   │   │   │   └── hello/route.ts    # Example API route
│   │   │   ├── auth/
│   │   │   │   ├── login/page.tsx    # Login page
│   │   │   │   └── register/page.tsx # Registration page
│   │   │   ├── dashboard/page.tsx    # Protected dashboard
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── page.tsx              # Home page
│   │   │   └── providers.tsx         # Relay provider setup
│   │   ├── __generated__/            # Generated Relay artifacts
│   │   ├── specs/                    # Jest tests
│   │   └── project.json              # Nx project config
│   └── web-e2e/                      # Playwright E2E tests
├── lib/
│   ├── graphql/
│   │   └── schema.ts                 # GraphQL schema & resolvers
│   ├── relay/
│   │   └── environment.ts            # Relay environment setup
│   └── prisma.ts                     # Prisma client instance
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Database migrations
├── generated/
│   └── prisma/                       # Generated Prisma client
├── docs/                             # Documentation
│   ├── tech.md                       # Technical architecture
│   ├── product.md                    # Product features
│   └── structure.md                  # Detailed structure
├── schema.graphql                    # GraphQL schema for Relay
├── relay.config.js                   # Relay compiler config
├── nx.json                           # Nx workspace config
└── package.json                      # Dependencies & scripts
```

See [docs/structure.md](docs/structure.md) for detailed information.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15 + React 19 | App Router, RSC, streaming SSR |
| **GraphQL Client** | Relay | Normalized cache, automatic batching, persisted queries |
| **GraphQL Server** | GraphQL Yoga | Standards-compliant, lightweight, extensible |
| **Database** | Prisma + PostgreSQL/SQLite | Type-safe ORM with declarative migrations |
| **Styling** | Tailwind CSS v4 | Just-in-time compilation, zero runtime |
| **Monorepo** | Nx | Distributed task execution, computation caching |
| **Auth** | JWT + bcrypt | Stateless authentication, secure password hashing |

## What's Included

- **Complete Authentication System** - Registration, login, protected routes, JWT token management
- **GraphQL API** - Fully typed schema with resolvers for user authentication
- **Database Layer** - Prisma schema with User model and migrations
- **UI Components** - Login/register pages with Tailwind styling
- **Type Safety** - End-to-end TypeScript from database to UI
- **Smart Compilation** - Nx automatically regenerates Relay artifacts on schema changes
- **Development Tools** - Prisma Studio for database management

## Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run relay            # Generate Relay artifacts (auto-runs via Nx)
npm run build            # Production build

# Database
npm run db:migrate       # Create and apply migrations
npm run db:reset         # Reset database (destructive)
npm run db:studio        # Open Prisma Studio GUI

# Monorepo
npx nx graph             # Visualize project dependencies
npx nx reset             # Clear Nx cache
npx nx test web          # Run unit tests
npx nx e2e web-e2e       # Run E2E tests
```

## Environment Variables

Create a `.env` file in the root:

```env
# Database (PostgreSQL - recommended)
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/myapp"

# Database (SQLite - alternative, simpler setup)
# DATABASE_URL="file:./dev.db"

# Authentication
JWT_SECRET="your-secret-key-change-in-production"

# Optional: Node environment
NODE_ENV="development"
```

**SQLite Alternative (no DB server required):**
```env
DATABASE_URL="file:./dev.db"
```

⚠️ **Security:** Never commit `.env` to version control. Generate a strong `JWT_SECRET` for production.

📖 **See also:** [Database Setup Guide](docs/database-setup.md) for PostgreSQL configuration and connection pooling.

## Development Workflow

### Modifying GraphQL Schema
```bash
# 1. Update schema and resolvers
vim lib/graphql/schema.ts
vim schema.graphql

# 2. Nx automatically regenerates Relay artifacts
# 3. Use in components with type-safe hooks
```

### Database Migrations
```bash
# Modify schema
vim prisma/schema.prisma

# Create migration
npm run db:migrate -- --name add_user_profile

# Prisma client auto-regenerates with new types
```

### Adding Protected Routes
```typescript
// Use getContext in API routes for JWT verification
export const getContext = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  // Returns { userId } if valid token
}
```

## Why This Stack?

- **Relay** - Best-in-class GraphQL client with normalized caching, eliminating redundant network requests
- **Nx** - Industry-proven monorepo tool used by Google, Microsoft, and enterprise teams
- **Prisma** - Type-safe database access prevents runtime errors and accelerates development
- **Next.js 15** - Production-grade framework with optimal performance defaults
- **GraphQL Yoga** - Minimal overhead, maximum flexibility for API development

**Learn more:** [Technical Architecture](docs/tech.md) | [Product Features](docs/product.md) | [Project Structure](docs/structure.md)

## Architecture Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Next.js App (Port 3000)        │
│  ┌──────────────────────────┐   │
│  │   React Components       │   │
│  │   (with Relay hooks)     │   │
│  └────────────┬─────────────┘   │
│               │                 │
│               ▼                 │
│  ┌──────────────────────────┐   │
│  │   API Routes             │   │
│  │   /api/graphql (Yoga)    │   │
│  └────────────┬─────────────┘   │
└───────────────┼─────────────────┘
                │
                ▼
       ┌────────────────┐
       │  Prisma ORM    │
       └────────┬───────┘
                │
                ▼
       ┌────────────────┐
       │  PostgreSQL/   │
       │  SQLite DB     │
       └────────────────┘
```

## Documentation

- 📘 [Database Setup & PostgreSQL Migration](docs/database-setup.md)
- 🏗️ [Technical Architecture](docs/tech.md)
- 📦 [Project Structure](docs/structure.md)
- 🎯 [Product Features](docs/product.md)

## License

MIT License - see [LICENSE](LICENSE) for details
