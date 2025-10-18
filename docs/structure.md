# Project Structure

This document provides a detailed breakdown of the Seed Web Stack directory structure, file organization, and the purpose of each component.

## Table of Contents

- [Root Directory](#root-directory)
- [Apps Directory](#apps-directory)
- [Lib Directory](#lib-directory)
- [Prisma Directory](#prisma-directory)
- [Generated Directory](#generated-directory)
- [Configuration Files](#configuration-files)
- [File Conventions](#file-conventions)

## Directory Tree

```
seed-web-stack/
├── .claude/                    # Claude Code configuration
├── .git/                       # Git version control
├── .nx/                        # Nx cache and artifacts
├── .vscode/                    # VS Code workspace settings
├── apps/                       # Applications (monorepo apps)
│   ├── web/                    # Next.js web application
│   │   ├── __generated__/      # Generated Relay types
│   │   ├── app/                # Next.js App Router
│   │   │   ├── api/            # API routes
│   │   │   │   ├── graphql/    # GraphQL endpoint
│   │   │   │   │   └── route.ts
│   │   │   │   └── hello/      # Example API route
│   │   │   │       └── route.ts
│   │   │   ├── auth/           # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── register/
│   │   │   │       └── page.tsx
│   │   │   ├── dashboard/      # Protected dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── providers.tsx   # Relay provider
│   │   │   └── globals.css     # Global styles
│   │   ├── specs/              # Unit tests
│   │   │   └── index.spec.tsx
│   │   ├── index.d.ts          # TypeScript declarations
│   │   ├── jest.config.ts      # Jest configuration
│   │   ├── next-env.d.ts       # Next.js types
│   │   ├── next.config.js      # Next.js configuration
│   │   ├── project.json        # Nx project configuration
│   │   ├── tsconfig.json       # TypeScript config
│   │   └── tsconfig.spec.json  # Test TypeScript config
│   └── web-e2e/                # E2E tests for web
│       ├── src/
│       │   └── example.spec.ts
│       ├── playwright.config.ts
│       ├── project.json
│       └── tsconfig.json
├── docs/                       # Documentation
│   ├── product.md             # Product features
│   ├── structure.md           # This file
│   └── tech.md                # Technical architecture
├── generated/                  # Generated code
│   └── prisma/                # Generated Prisma client
│       └── index.d.ts         # Prisma types
├── lib/                        # Shared libraries
│   ├── graphql/               # GraphQL server
│   │   └── schema.ts          # Schema & resolvers
│   ├── relay/                 # Relay configuration
│   │   └── environment.ts     # Relay environment
│   └── prisma.ts              # Prisma client instance
├── node_modules/              # Dependencies
├── prisma/                    # Database
│   ├── migrations/            # Database migrations
│   │   └── 20250118_init/
│   │       └── migration.sql
│   ├── dev.db                 # SQLite database (dev)
│   └── schema.prisma          # Prisma schema
├── .editorconfig              # Editor configuration
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
├── .prettierignore            # Prettier ignore
├── .prettierrc                # Prettier config
├── eslint.config.mjs          # ESLint configuration
├── jest.config.ts             # Root Jest config
├── jest.preset.js             # Jest preset
├── nx.json                    # Nx workspace config
├── package-lock.json          # Lock file
├── package.json               # Dependencies & scripts
├── postcss.config.js          # PostCSS config
├── README.md                  # Main documentation
├── relay.config.js            # Relay compiler config
├── schema.graphql             # GraphQL schema (for Relay)
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.base.json         # Base TypeScript config
└── tsconfig.json              # Root TypeScript config
```

## Root Directory

### Core Files

| File | Purpose | Modified |
|------|---------|----------|
| `package.json` | NPM dependencies, scripts, workspace config | Frequently |
| `package-lock.json` | Lock file for exact dependency versions | Auto-generated |
| `.env` | Environment variables (secrets, config) | As needed |
| `.gitignore` | Files to exclude from Git | Rarely |
| `README.md` | Main project documentation | As needed |

### Configuration Files

| File | Purpose | Technology |
|------|---------|------------|
| `nx.json` | Nx workspace configuration | Nx |
| `tsconfig.json` | Root TypeScript configuration | TypeScript |
| `tsconfig.base.json` | Base TypeScript paths and options | TypeScript |
| `eslint.config.mjs` | Linting rules | ESLint |
| `jest.config.ts` | Testing configuration | Jest |
| `jest.preset.js` | Jest defaults | Jest |
| `tailwind.config.js` | Tailwind CSS customization | Tailwind |
| `postcss.config.js` | PostCSS plugins | PostCSS |
| `relay.config.js` | Relay compiler settings | Relay |
| `schema.graphql` | GraphQL schema for code generation | GraphQL |
| `.prettierrc` | Code formatting rules | Prettier |
| `.editorconfig` | Editor settings | EditorConfig |

### Hidden Directories

| Directory | Purpose | Commit? |
|-----------|---------|---------|
| `.git/` | Git version control data | Auto |
| `.nx/` | Nx cache and build artifacts | No |
| `.vscode/` | VS Code workspace settings | Optional |
| `.claude/` | Claude Code configuration | Optional |
| `node_modules/` | Installed dependencies | No |

## Apps Directory

The `apps/` directory contains all applications in the monorepo. Currently includes:

### apps/web/

**Type**: Next.js 15 Application (App Router)
**Port**: 4200
**Purpose**: Main web application with authentication

#### Directory Structure

```
apps/web/
├── __generated__/              # Auto-generated by Relay
│   ├── pageLoginMutation.graphql.ts
│   ├── pageQuery.graphql.ts
│   └── pageRegisterMutation.graphql.ts
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes
│   ├── auth/                   # Auth pages
│   ├── dashboard/              # Protected pages
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── providers.tsx           # Client providers
│   └── globals.css             # Global styles
├── specs/                      # Jest unit tests
├── jest.config.ts              # Jest configuration
├── next.config.js              # Next.js settings
├── project.json                # Nx project metadata
└── tsconfig.json               # TypeScript config
```

#### Key Files

**`apps/web/app/layout.tsx`**
- Root layout component
- Wraps all pages
- Includes Relay provider
- Sets up global HTML structure
- Loads fonts and global styles

```typescript
import { Providers } from './providers';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**`apps/web/app/providers.tsx`**
- Client component for Relay setup
- Wraps children with RelayEnvironmentProvider
- Initializes Relay environment

**`apps/web/app/page.tsx`**
- Home/landing page
- Links to login and register
- Server component by default

**`apps/web/app/api/graphql/route.ts`**
- GraphQL API endpoint
- Uses GraphQL Yoga
- Handles POST requests
- Integrates schema and context

```typescript
import { createYoga } from 'graphql-yoga';
import { schema, getContext } from '../../../../../lib/graphql/schema';

const { handleRequest } = createYoga({
  schema,
  context: ({ request }) => getContext(request),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response }
});

export { handleRequest as GET, handleRequest as POST };
```

**`apps/web/app/auth/login/page.tsx`**
- Login form component
- Client component ('use client')
- Uses Relay useMutation hook
- Handles authentication flow
- Stores JWT token

**`apps/web/app/auth/register/page.tsx`**
- Registration form component
- Similar structure to login
- Creates new user account
- Auto-login after registration

**`apps/web/app/dashboard/page.tsx`**
- Protected dashboard page
- Requires authentication
- Displays user information
- Uses Relay for data fetching

**`apps/web/project.json`**
- Nx project configuration
- Defines build, serve, test targets
- Port configuration (4200)
- Build options

```json
{
  "name": "web",
  "targets": {
    "build": { ... },
    "serve": {
      "options": {
        "port": 4200
      }
    },
    "test": { ... }
  }
}
```

**`apps/web/__generated__/`**
- Auto-generated by Relay compiler
- TypeScript types for GraphQL operations
- Never edit manually
- Regenerated with `npm run relay`

### apps/web-e2e/

**Type**: Playwright E2E Tests
**Purpose**: End-to-end testing for web app

```
apps/web-e2e/
├── src/
│   └── example.spec.ts        # Sample E2E test
├── playwright.config.ts       # Playwright configuration
├── project.json               # Nx configuration
└── tsconfig.json              # TypeScript config
```

## Lib Directory

Shared library code used across applications.

```
lib/
├── graphql/
│   └── schema.ts              # GraphQL schema & resolvers
├── relay/
│   └── environment.ts         # Relay client setup
└── prisma.ts                  # Prisma client singleton
```

### lib/graphql/schema.ts

**Purpose**: GraphQL server implementation
**Size**: ~100 lines
**Dependencies**: graphql-yoga, prisma, bcryptjs, jsonwebtoken

**Structure**:
```typescript
import { createSchema } from 'graphql-yoga';
import { prisma } from '../prisma';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// Schema definition
export const schema = createSchema({
  typeDefs: `...`,  // GraphQL types
  resolvers: {      // Query & Mutation resolvers
    Query: { ... },
    Mutation: { ... }
  }
});

// Context creator (JWT validation)
export function getContext(request: Request) {
  // Extract and validate JWT
  // Return { userId }
}
```

**Exports**:
- `schema` - GraphQL schema object
- `getContext()` - Context function for auth

### lib/relay/environment.ts

**Purpose**: Relay client configuration
**Size**: ~40 lines

**Structure**:
```typescript
import { Environment, Network, RecordSource, Store } from 'relay-runtime';

// Fetch function for GraphQL requests
const fetchQuery = async (params, variables) => {
  // Make HTTP request to /api/graphql
  // Include Authorization header
  // Return JSON response
};

// Create and export Relay environment
export const relayEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
});
```

**Exports**:
- `relayEnvironment` - Configured Relay environment

### lib/prisma.ts

**Purpose**: Prisma client singleton
**Size**: ~5 lines

**Structure**:
```typescript
import { PrismaClient } from '../generated/prisma';

export const prisma = new PrismaClient();
```

**Why Singleton?**
- Prevents multiple database connections
- Reuses connection pool
- Best practice for serverless

## Prisma Directory

Database schema and migrations.

```
prisma/
├── migrations/                 # Database migration history
│   ├── migration_lock.toml     # Lock file
│   └── 20250118_init/
│       └── migration.sql       # SQL for migration
├── dev.db                      # SQLite database file (dev)
└── schema.prisma               # Prisma schema definition
```

### prisma/schema.prisma

**Purpose**: Database schema definition
**Language**: Prisma Schema Language

**Structure**:
```prisma
// Client generator
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

// Database connection
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Data models
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Key Concepts**:
- `generator` - Specifies how to generate client
- `datasource` - Database provider and connection
- `model` - Database table definitions
- `@id` - Primary key
- `@unique` - Unique constraint
- `@default()` - Default values
- `@updatedAt` - Auto-update timestamp

### prisma/migrations/

**Purpose**: Version-controlled database schema changes
**Auto-generated**: By `prisma migrate dev`

**Example Migration** (`20250118_init/migration.sql`):
```sql
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
```

**Migration Workflow**:
1. Edit `schema.prisma`
2. Run `npx prisma migrate dev --name <migration_name>`
3. Prisma generates SQL and applies it
4. Migration saved in `migrations/` directory
5. Commit migration files to Git

### prisma/dev.db

**Type**: SQLite database file
**Purpose**: Development database
**Gitignore**: Yes (excluded from version control)
**Size**: Grows with data

**Access**:
- Via Prisma Client (in code)
- Via Prisma Studio (`npx prisma studio`)
- Via SQLite CLI (`sqlite3 prisma/dev.db`)

## Generated Directory

Auto-generated code that should not be edited manually.

```
generated/
└── prisma/                     # Prisma Client
    ├── index.js                # Client implementation
    ├── index.d.ts              # TypeScript definitions
    └── ... (many internal files)
```

### generated/prisma/

**Generated by**: `npx prisma generate`
**Purpose**: Type-safe database client
**Size**: Large (many files)
**Gitignore**: Yes

**Key Exports** (`index.d.ts`):
```typescript
export class PrismaClient {
  user: {
    create(args: UserCreateArgs): Promise<User>;
    findUnique(args: UserFindUniqueArgs): Promise<User | null>;
    findMany(args?: UserFindManyArgs): Promise<User[]>;
    update(args: UserUpdateArgs): Promise<User>;
    delete(args: UserDeleteArgs): Promise<User>;
    // ... many more
  };
}

export type User = {
  id: string;
  email: string;
  password: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
};
```

**Usage**:
```typescript
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});
```

## Configuration Files

### nx.json

**Purpose**: Nx workspace configuration
**Key Sections**:

```json
{
  "plugins": [
    "@nx/next/plugin",    // Next.js support
    "@nx/jest/plugin",    // Jest testing
    "@nx/playwright/plugin", // E2E testing
    "@nx/eslint/plugin"   // Linting
  ],
  "targetDefaults": {
    "test": {
      "dependsOn": ["^build"]  // Run builds before tests
    }
  }
}
```

### tsconfig.base.json

**Purpose**: Base TypeScript configuration
**Inheritance**: Extended by all other tsconfig files

```json
{
  "compilerOptions": {
    "paths": {
      "@my-app/*": ["*"]  // Path aliases
    },
    "strict": true,       // Strict type checking
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### relay.config.js

**Purpose**: Relay compiler configuration

```javascript
module.exports = {
  src: "./apps/web",                    // Source directory
  schema: "./schema.graphql",           // GraphQL schema
  language: "typescript",               // Output language
  artifactDirectory: "./apps/web/__generated__"  // Output dir
};
```

**Usage**: `npm run relay` reads this config

### tailwind.config.js

**Purpose**: Tailwind CSS configuration

```javascript
module.exports = {
  content: [
    './apps/web/**/*.{js,ts,jsx,tsx}'  // Files to scan
  ],
  theme: {
    extend: {}  // Customizations
  },
  plugins: []
};
```

## File Conventions

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `LoginPage.tsx` |
| Utilities | camelCase | `prisma.ts` |
| Config files | kebab-case | `relay.config.js` |
| Pages (Next.js) | lowercase | `page.tsx` |
| API routes | lowercase | `route.ts` |
| Test files | `*.spec.ts` | `index.spec.tsx` |
| Types | PascalCase | `User`, `AuthPayload` |

### File Extensions

| Extension | Purpose |
|-----------|---------|
| `.ts` | TypeScript source |
| `.tsx` | TypeScript + JSX (React) |
| `.js` | JavaScript |
| `.mjs` | ES Module JavaScript |
| `.json` | JSON configuration |
| `.md` | Markdown documentation |
| `.prisma` | Prisma schema |
| `.graphql` | GraphQL schema |
| `.css` | Stylesheets |

### Special Files (Next.js)

| File | Purpose | Location |
|------|---------|----------|
| `layout.tsx` | Layout wrapper | `app/` or any route |
| `page.tsx` | Page component | `app/` or any route |
| `route.ts` | API route handler | `app/api/` |
| `loading.tsx` | Loading UI | Any route |
| `error.tsx` | Error UI | Any route |
| `not-found.tsx` | 404 page | Any route |

### Directory Conventions

| Pattern | Meaning | Example |
|---------|---------|---------|
| `__generated__/` | Auto-generated code | Relay artifacts |
| `__tests__/` | Test files | Jest tests |
| `api/` | API routes | Next.js API |
| `[id]/` | Dynamic route | `app/users/[id]` |
| `(group)/` | Route group | `app/(auth)/login` |

## Import Paths

### Relative Imports

```typescript
// From apps/web/app/dashboard/page.tsx
import { relayEnvironment } from '../../../lib/relay/environment';
```

### Path Aliases

Can be configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/lib/*": ["lib/*"],
      "@/components/*": ["apps/web/components/*"]
    }
  }
}
```

Usage:
```typescript
import { schema } from '@/lib/graphql/schema';
```

## Build Artifacts

### Development

| Artifact | Location | Gitignore |
|----------|----------|-----------|
| Next.js cache | `.next/` | Yes |
| Nx cache | `.nx/cache/` | Yes |
| Prisma client | `generated/prisma/` | Yes |
| Relay types | `__generated__/` | Yes |
| Database | `prisma/dev.db` | Yes |

### Production

| Artifact | Location | Deploy |
|----------|----------|--------|
| Next.js build | `.next/` | Yes |
| Prisma client | `generated/prisma/` | Generate on deploy |
| Relay types | `__generated__/` | Generate before build |

## Adding New Files

### Adding a Page

1. Create `apps/web/app/your-page/page.tsx`
2. Export default React component
3. Navigate to `/your-page`

### Adding an API Route

1. Create `apps/web/app/api/your-route/route.ts`
2. Export GET, POST, etc. handlers
3. Access at `/api/your-route`

### Adding a Library

1. Create file in `lib/your-lib/index.ts`
2. Export functions/classes
3. Import from `../../lib/your-lib`

### Adding a Database Model

1. Add model to `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_model`
3. Run `npx prisma generate`
4. Use in code via `prisma.yourModel`

### Adding a GraphQL Type

1. Update `lib/graphql/schema.ts` (typeDefs + resolvers)
2. Update `schema.graphql` to match
3. Run `npm run relay`
4. Use in components with `graphql` tag

## Best Practices

### Organization

✅ **Keep related files together**
- Co-locate tests with source (`*.spec.ts` next to `*.ts`)
- Keep page components in their route folders
- Group related utilities in `lib/`

✅ **Use clear naming**
- Descriptive file names (`userSchema.ts` not `schema.ts`)
- Match file names to exports (`LoginPage.tsx` exports `LoginPage`)

✅ **Don't over-nest**
- Max 3-4 levels of nesting
- Use flat structures when possible

### Imports

✅ **Prefer absolute imports** (with path aliases)
❌ **Avoid deep relative imports** (`../../../lib/...`)

✅ **Group imports**
1. External packages
2. Internal absolute imports
3. Relative imports
4. Styles

```typescript
// Good
import React from 'react';
import { useMutation } from 'react-relay';

import { relayEnvironment } from '@/lib/relay/environment';

import './styles.css';
```

### File Size

✅ **Keep files focused**
- Single responsibility
- ~200 lines max (guideline)
- Extract when too complex

✅ **Split large components**
- Extract sub-components
- Use separate files

## Troubleshooting Structure Issues

### Can't Find Module

**Symptom**: `Cannot find module '../../lib/prisma'`
**Solutions**:
- Check file exists at correct path
- Verify import path is correct
- Check `tsconfig.json` paths
- Restart TypeScript server (VS Code)

### Generated Files Missing

**Symptom**: `Cannot find '../generated/prisma'`
**Solution**: Run `npx prisma generate`

**Symptom**: `Cannot find '__generated__/MyMutation.graphql'`
**Solution**: Run `npm run relay`

### Import Errors

**Symptom**: Import works but TypeScript complains
**Solutions**:
- Check `tsconfig.json` includes the file
- Verify file extension is correct
- Check for circular dependencies

## Summary

The Seed Web Stack follows a clear, conventional structure:

- **`apps/`** - Applications (Next.js web app, E2E tests)
- **`lib/`** - Shared libraries (GraphQL, Relay, Prisma)
- **`prisma/`** - Database schema and migrations
- **`generated/`** - Auto-generated code (Prisma, Relay)
- **`docs/`** - Documentation
- **Root** - Configuration files

This structure supports:
- ✅ Clear separation of concerns
- ✅ Easy to navigate
- ✅ Scalable to multiple apps
- ✅ Standard conventions
- ✅ Tool integration (Nx, Next.js, Prisma, Relay)

For more details, see:
- [README.md](../README.md) - Getting started
- [docs/tech.md](tech.md) - Technical details
- [docs/product.md](product.md) - Features and usage
