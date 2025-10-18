# Seed Web Stack - Modern Full-Stack Monorepo

A production-ready web application starter template featuring a modern authentication system built with industry-standard tools and best practices.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **GraphQL Yoga** - Lightweight GraphQL server
- **Relay** - High-performance GraphQL client
- **Prisma** - Type-safe ORM with SQLite
- **Tailwind CSS v4** - Utility-first CSS framework
- **Nx** - Smart monorepo build system
- **TypeScript** - End-to-end type safety
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

## Quick Start

### Prerequisites
- Node.js 20+ and npm
- Git

### Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/rightson/seed-web-stack
   cd seed-web-stack
   npm install
   ```

2. **Environment Setup**

   Create a `.env` file in the root:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key-change-in-production"
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Generate GraphQL Types**
   ```bash
   npm run relay
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:4200](http://localhost:4200) to see your app.

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

## Features

### Authentication & Security
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Protected routes and server-side auth
- ✅ Token-based session management

### Development Experience
- ✅ Full TypeScript support
- ✅ Type-safe database queries with Prisma
- ✅ Auto-generated GraphQL types with Relay
- ✅ Hot reload and fast refresh
- ✅ Monorepo structure with Nx
- ✅ Code generation workflow

### Architecture
- ✅ GraphQL API with Yoga
- ✅ Optimized queries with Relay
- ✅ SQLite database (easily swappable)
- ✅ Modern styling with Tailwind CSS v4
- ✅ Component-based architecture
- ✅ API route handlers

See [docs/product.md](docs/product.md) and [docs/tech.md](docs/tech.md) for more details.

## Available Scripts

### Development
- `npm run dev` - Start development server on port 4200
- `npm run relay` - Generate Relay GraphQL types
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx nx serve web` - Run dev server via Nx

### Production
- `npm run build` - Build for production
- `npx nx build web` - Production build via Nx
- `npm start` - Start production server

### Database
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma migrate deploy` - Apply migrations in production
- `npx prisma db push` - Push schema changes without migrations

### Testing
- `npx nx test web` - Run unit tests
- `npx nx e2e web-e2e` - Run E2E tests with Playwright

### Code Quality
- `npx nx lint web` - Lint the web app
- `npx prettier --write .` - Format code

### Nx Utilities
- `npx nx show project web` - Show available targets
- `npx nx graph` - View dependency graph
- `npx nx reset` - Clear Nx cache

## Environment Variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
JWT_SECRET="your-secret-key-change-in-production"

# Optional: Node environment
NODE_ENV="development"
```

**Important**: Never commit `.env` to version control. Change `JWT_SECRET` in production.

## Development Workflow

### Making Database Changes
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_migration_name`
3. Run `npx prisma generate` to update the client

### Adding GraphQL Types
1. Update `lib/graphql/schema.ts` (typeDefs and resolvers)
2. Update `schema.graphql` to match
3. Run `npm run relay` to generate TypeScript types
4. Use in components with `graphql` template tag

### Creating New Pages
1. Add page in `apps/web/app/`
2. Use Relay for data fetching
3. Protected routes: check JWT in API routes or use middleware

## Key Technologies

| Tool | Purpose | Why We Use It |
|------|---------|---------------|
| **Next.js 15** | React framework | App Router, RSC, API routes, optimizations |
| **GraphQL Yoga** | GraphQL server | Lightweight, standards-compliant, easy setup |
| **Relay** | GraphQL client | Performance, type safety, automatic caching |
| **Prisma** | ORM | Type safety, migrations, database abstraction |
| **Nx** | Build system | Monorepo management, caching, task orchestration |
| **Tailwind CSS** | Styling | Utility-first, fast, customizable |

See [docs/tech.md](docs/tech.md) for in-depth technical details.

## Architecture Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Next.js App (Port 4200)        │
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
       │  SQLite DB     │
       └────────────────┘
```

## License

MIT
