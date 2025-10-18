# Technical Architecture

This document provides in-depth technical details about the Seed Web Stack architecture, design decisions, and implementation patterns.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Data Flow](#data-flow)
- [Authentication System](#authentication-system)
- [GraphQL Layer](#graphql-layer)
- [Database Layer](#database-layer)
- [Frontend Architecture](#frontend-architecture)
- [Build System](#build-system)
- [Development Workflow](#development-workflow)

## Architecture Overview

The Seed Web Stack follows a modern **monolithic full-stack architecture** with clear separation of concerns:

```
┌────────────────────────────────────────────────────────────┐
│                        Browser                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Components (TypeScript)                       │  │
│  │  └─ Relay GraphQL Client (Type-safe)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────┬───────────────────────────────────────────┘
                 │ HTTP/GraphQL
                 ▼
┌────────────────────────────────────────────────────────────┐
│            Next.js Server (Port 4200)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  App Router (React Server Components)               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes                                          │  │
│  │  └─ /api/graphql → GraphQL Yoga Server              │  │
│  │     └─ Schema & Resolvers                           │  │
│  │        └─ Context (JWT Auth)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────┬───────────────────────────────────────────┘
                 │ Prisma Client
                 ▼
┌────────────────────────────────────────────────────────────┐
│                   Database Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Prisma ORM (Type-safe)                              │  │
│  │  └─ Generated Client                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SQLite Database                                     │  │
│  │  └─ User table                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Core Framework: Next.js 15

**Version**: 15.2.4
**Features Used**:
- **App Router** - File-system based routing with React Server Components
- **API Routes** - Serverless function endpoints
- **Server Components** - Default server-side rendering for better performance
- **Client Components** - Interactive components with `'use client'`
- **TypeScript** - Full type safety across the stack

**Why Next.js?**
- Industry standard for React applications
- Excellent DX with hot reload
- Built-in optimizations (code splitting, image optimization)
- Easy deployment to Vercel, but works anywhere
- Unified codebase for client and server

### GraphQL Server: GraphQL Yoga

**Version**: 5.16.0
**Package**: `graphql-yoga`

**Architecture**:
```typescript
// lib/graphql/schema.ts
import { createSchema } from 'graphql-yoga';

export const schema = createSchema({
  typeDefs: /* GraphQL */ `...`,
  resolvers: {
    Query: { ... },
    Mutation: { ... }
  }
});

export function getContext(request: Request) {
  // JWT validation and context creation
  const authHeader = request.headers.get('authorization');
  // ... decode JWT and return { userId }
}
```

**Features**:
- Schema-first development
- Built-in GraphiQL playground at `/api/graphql`
- Standards-compliant (GraphQL-over-HTTP spec)
- Lightweight and performant
- TypeScript native

**Why GraphQL Yoga?**
- Simpler than Apollo Server
- Modern, actively maintained
- Works seamlessly with Next.js API routes
- Built-in CORS and security features
- No vendor lock-in

### GraphQL Client: Relay

**Version**: 20.1.1
**Packages**:
- `react-relay` - React bindings
- `relay-runtime` - Core runtime
- `relay-compiler` - Code generation
- `babel-plugin-relay` - Babel transform

**Setup**:
```typescript
// lib/relay/environment.ts
import { Environment, Network, RecordSource, Store } from 'relay-runtime';

const fetchQuery = async (params, variables) => {
  const response = await fetch('http://localhost:4200/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query: params.text, variables })
  });
  return response.json();
};

export const relayEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
});
```

**Code Generation**:
```javascript
// relay.config.js
module.exports = {
  src: "./apps/web",
  schema: "./schema.graphql",
  language: "typescript",
  artifactDirectory: "./apps/web/__generated__"
};
```

**Usage Pattern**:
```typescript
// apps/web/app/auth/login/page.tsx
import { graphql } from 'relay-runtime';
import { useMutation } from 'react-relay';

const LoginMutation = graphql`
  mutation pageLoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id email name }
    }
  }
`;

function LoginPage() {
  const [login] = useMutation(LoginMutation);
  // ...
}
```

**Why Relay?**
- Automatic query optimization and deduplication
- Strong type safety with generated TypeScript
- Efficient data fetching and caching
- Co-location of data requirements with components
- Production-proven (used by Meta/Facebook)

### ORM: Prisma

**Version**: 6.17.1
**Packages**:
- `prisma` - CLI and migration tools
- `@prisma/client` - Generated database client

**Schema** (`prisma/schema.prisma`):
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Client Usage**:
```typescript
// lib/prisma.ts
import { PrismaClient } from '../generated/prisma';

export const prisma = new PrismaClient();

// In resolvers
const user = await prisma.user.findUnique({
  where: { email }
});
```

**Why Prisma?**
- Type-safe database queries
- Automatic migrations
- Database agnostic (easy to switch from SQLite to PostgreSQL)
- Excellent DX with Prisma Studio
- Auto-completion and IntelliSense

### Monorepo: Nx

**Version**: 21.6.5

**Configuration** (`nx.json`):
```json
{
  "plugins": [
    "@nx/next/plugin",
    "@nx/jest/plugin",
    "@nx/playwright/plugin",
    "@nx/eslint/plugin"
  ],
  "targetDefaults": {
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Benefits**:
- **Computation Caching** - Only rebuild what changed
- **Task Orchestration** - Run tasks in optimal order
- **Code Generation** - Scaffolding tools
- **Dependency Graph** - Visualize project structure
- **Affected Commands** - Only test/build affected projects

**Why Nx?**
- Built for TypeScript/Node monorepos
- Scales to hundreds of projects
- Great VS Code integration
- Active community and plugins

### Styling: Tailwind CSS

**Version**: 4.1.14

**Configuration**:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./apps/web/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  }
};
```

**Why Tailwind?**
- Utility-first approach
- No CSS file management
- Consistent design system
- JIT compilation for smaller bundles
- Easy to customize

## Data Flow

### Authentication Flow

```
1. User submits login form
   └─> Client Component (LoginPage)

2. Relay mutation executed
   └─> POST /api/graphql
       └─> GraphQL Yoga parses request
           └─> login() resolver called
               └─> Prisma.user.findUnique()
               └─> bcrypt.compare(password, hash)
               └─> jwt.sign({ userId })
               └─> return { token, user }

3. Client receives response
   └─> Store token in localStorage
   └─> Redirect to dashboard

4. Subsequent requests include token
   └─> Authorization: Bearer <token>
       └─> getContext() validates JWT
           └─> Returns { userId }
               └─> Available in all resolvers
```

### Query Flow (Protected Route)

```
1. Dashboard page loads
   └─> Relay Query for viewer data
       └─> POST /api/graphql with Authorization header

2. Server processes request
   └─> getContext() extracts userId from JWT
       └─> viewer() resolver receives context
           └─> Prisma.user.findUnique({ where: { id: userId } })
           └─> Return user data

3. Relay caches and normalizes data
   └─> Component receives typed data
       └─> Renders UI
```

## Authentication System

### Password Security

- **Hashing Algorithm**: bcrypt with salt rounds of 10
- **Storage**: Never store plaintext passwords
- **Validation**: Compare hashed values on login

```typescript
// Registration
const hashedPassword = await bcrypt.hash(password, 10);
await prisma.user.create({
  data: { email, password: hashedPassword, name }
});

// Login
const valid = await bcrypt.compare(password, user.password);
if (!valid) throw new Error('Invalid credentials');
```

### JWT Tokens

**Structure**:
```json
{
  "userId": "uuid-here",
  "iat": 1234567890
}
```

**Implementation**:
```typescript
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

// Sign
const token = jwt.sign({ userId: user.id }, JWT_SECRET);

// Verify
const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
```

**Token Flow**:
1. Issued on successful login/registration
2. Stored in browser (localStorage)
3. Sent in `Authorization: Bearer <token>` header
4. Validated on each GraphQL request
5. userId extracted and passed to resolvers via context

**Security Considerations**:
- Token doesn't expire (add expiration in production)
- No refresh token mechanism (implement for production)
- Secret should be strong and environment-specific
- HTTPS required in production

## GraphQL Layer

### Schema Design

**Type Definitions**:
```graphql
type User {
  id: ID!
  email: String!
  name: String
  createdAt: String!
}

type AuthPayload {
  token: String!
  user: User!
}

type Query {
  me: User
  viewer: User
}

type Mutation {
  register(email: String!, password: String!, name: String): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
}
```

**Design Principles**:
- Return types mirror database models
- Mutation responses include full objects (allows Relay to update cache)
- Nullable fields for optional data
- Separate AuthPayload for login/register (includes token + user)

### Resolver Patterns

**Context-Based Auth**:
```typescript
Query: {
  viewer: async (_, __, context) => {
    if (!context.userId) return null;
    return prisma.user.findUnique({
      where: { id: context.userId }
    });
  }
}
```

**Error Handling**:
```typescript
Mutation: {
  register: async (_, { email, password, name }) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('User already exists');
    // ...
  }
}
```

## Database Layer

### Schema Design

```prisma
model User {
  id        String   @id @default(uuid())  // UUID primary key
  email     String   @unique                // Enforced uniqueness
  password  String                          // Bcrypt hash
  name      String?                         // Optional field
  createdAt DateTime @default(now())        // Auto timestamp
  updatedAt DateTime @updatedAt             // Auto updated
}
```

**Design Decisions**:
- UUIDs over auto-increment integers (better for distributed systems)
- Unique constraint on email (prevents duplicates)
- Separate createdAt/updatedAt for audit trail
- Optional name field (minimal required data)

### Migrations

**Development**:
```bash
npx prisma migrate dev --name add_user_table
```

**Production**:
```bash
npx prisma migrate deploy
```

**Generated Files**:
```
prisma/
└── migrations/
    └── 20250118_init/
        └── migration.sql
```

### Switching Databases

To use PostgreSQL instead of SQLite:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

3. Run migrations:
```bash
npx prisma migrate dev
```

## Frontend Architecture

### Component Structure

```
apps/web/app/
├── layout.tsx          # Root layout with Relay provider
├── providers.tsx       # Client-side Relay environment
├── page.tsx            # Home page (Server Component)
├── auth/
│   ├── login/
│   │   └── page.tsx    # Login form (Client Component)
│   └── register/
│       └── page.tsx    # Register form (Client Component)
└── dashboard/
    └── page.tsx        # Protected route (Client Component)
```

### Relay Integration

**Provider Setup**:
```typescript
// app/providers.tsx
'use client';

import { RelayEnvironmentProvider } from 'react-relay';
import { relayEnvironment } from '../../lib/relay/environment';

export function Providers({ children }) {
  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
```

**Query Pattern**:
```typescript
'use client';

import { graphql } from 'relay-runtime';
import { useMutation } from 'react-relay';

const LoginMutation = graphql`
  mutation pageLoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;
```

### State Management

- **Server State**: Managed by Relay (GraphQL cache)
- **Local State**: React useState/useReducer
- **Auth Token**: localStorage (consider httpOnly cookies for production)

## Build System

### Nx Task Graph

```
┌─────────────┐
│   relay     │ (Generate Relay types)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   build     │ (Next.js build)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   serve     │ (Start server)
└─────────────┘
```

### Code Generation Pipeline

1. **GraphQL Schema** → `schema.graphql`
2. **Relay Compiler** → Reads schema + component queries
3. **Generated Types** → `apps/web/__generated__/*.ts`
4. **TypeScript** → Type checks using generated types
5. **Next.js Build** → Production bundle

### Compilation Steps

```bash
npm run relay        # Step 1: Generate Relay artifacts
npm run build        # Step 2: TypeScript → JavaScript (Next.js)
npm start            # Step 3: Start production server
```

## Development Workflow

### Initial Setup
```bash
npm install                              # Install dependencies
npx prisma generate                      # Generate Prisma client
npx prisma migrate dev --name init       # Create database
npm run relay                            # Generate Relay types
npm run dev                              # Start dev server
```

### Making Changes

**Database Schema**:
```bash
# 1. Edit prisma/schema.prisma
# 2. Generate migration
npx prisma migrate dev --name add_column
# 3. Regenerate client
npx prisma generate
```

**GraphQL Schema**:
```bash
# 1. Edit lib/graphql/schema.ts (typeDefs + resolvers)
# 2. Update schema.graphql
# 3. Regenerate Relay types
npm run relay
```

**UI Components**:
```bash
# 1. Add/edit component in apps/web/app/
# 2. Use graphql template tag for queries
# 3. Save (Next.js hot reloads)
# 4. Run relay compiler if GraphQL changed
npm run relay
```

### Testing

**Unit Tests** (Jest):
```bash
npx nx test web
```

**E2E Tests** (Playwright):
```bash
npx nx e2e web-e2e
```

**Type Checking**:
```bash
npx nx typecheck web
```

## Performance Considerations

### Relay Optimization
- Automatic query batching
- Normalized cache (no duplicate data)
- Automatic garbage collection

### Next.js Optimization
- Automatic code splitting
- Image optimization
- Font optimization
- Static generation where possible

### Database Optimization
- Indexed fields (email unique index)
- Connection pooling (Prisma default)
- Query optimization via Prisma

## Security Best Practices

### Implemented
✅ Password hashing with bcrypt
✅ JWT for stateless auth
✅ Type safety (prevents many bugs)
✅ Input validation (GraphQL schema)
✅ Unique constraints (email)

### Production Recommendations
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Use httpOnly cookies for tokens
- [ ] Add token expiration and refresh
- [ ] Enable CORS properly
- [ ] Use HTTPS only
- [ ] Add request validation middleware
- [ ] Implement audit logging
- [ ] Add database backups
- [ ] Use environment-specific secrets

## Deployment

### Environment Variables
```env
DATABASE_URL="postgresql://..."  # Production database
JWT_SECRET="strong-random-secret"
NODE_ENV="production"
```

### Build Process
```bash
npm run build
npm start
```

### Deployment Platforms
- **Vercel** - Zero config, recommended
- **Railway** - Simple, includes database
- **Fly.io** - Docker-based
- **AWS/GCP/Azure** - Full control

## Extensibility

### Adding Features

**New Database Model**:
1. Add to `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Add GraphQL types and resolvers
4. Update `schema.graphql`
5. Run `npm run relay`

**New Page**:
1. Create in `apps/web/app/`
2. Use Relay for data fetching
3. Style with Tailwind

**New API Endpoint**:
1. Add resolver to `lib/graphql/schema.ts`
2. Update schema
3. Generate types

## Troubleshooting

### Common Issues

**Relay types not found**:
```bash
npm run relay  # Regenerate types
```

**Prisma client outdated**:
```bash
npx prisma generate
```

**Port 4200 in use**:
```bash
# Kill process or change port in project.json
```

**JWT_SECRET error**:
```bash
# Ensure .env file exists with JWT_SECRET
```

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)
- [Relay Documentation](https://relay.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Nx Documentation](https://nx.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
