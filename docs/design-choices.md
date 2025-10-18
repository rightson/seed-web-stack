# Design Choices

This document explains key architectural decisions made in this stack and the rationale behind them.

## Table of Contents

- [Babel vs SWC](#babel-vs-swc)
- [PostgreSQL as Default Database](#postgresql-as-default-database)
- [Relay over Apollo/URQL](#relay-over-apollourql)
- [Nx Monorepo Structure](#nx-monorepo-structure)
- [JWT Authentication](#jwt-authentication)
- [Direct Environment Variable Loading](#direct-environment-variable-loading)

---

## Babel vs SWC

**Decision:** Use Babel for transpilation instead of Next.js's default SWC compiler.

### Why Babel?

- **Relay Requirement:** Relay's GraphQL compiler requires `babel-plugin-relay` for production-ready builds
- **Stability:** Babel plugin ecosystem is mature and battle-tested
- **Relay SWC Status:** `@relay/swc-plugin-relay-swc` is still experimental (not production-ready)

### Performance Tradeoff

- **SWC:** ~20x faster compilation (written in Rust)
- **Babel:** Slower but reliable (~1-2s difference for this codebase size)

### The "500KB Warning"

You'll see this warning during development:

```
[BABEL] Note: The code generator has deoptimised the styling of
/node_modules/next/dist/compiled/next-devtools/index.js as it exceeds the max of 500KB.
```

**This is safe to ignore:**
- Only affects Next.js internal dev tools
- Not included in production builds
- Doesn't impact runtime performance

### When to Reconsider

Switch to SWC when:
1. Relay's SWC plugin reaches stable release
2. Build times become a bottleneck (large codebase)
3. You're not using Relay

**Reference:** [Relay SWC Plugin Discussion](https://github.com/facebook/relay/discussions)

---

## PostgreSQL as Default Database

**Decision:** Use PostgreSQL as the recommended default, with SQLite as an alternative.

### Why PostgreSQL?

- **Production-Ready:** Most production deployments use PostgreSQL
- **Feature-Rich:** Advanced features like JSON columns, full-text search, GIS support
- **Scalability:** Better concurrency and performance for multi-user applications
- **Hosted Options:** Easy deployment on Supabase, Railway, Render, Heroku
- **Data Integrity:** Stronger ACID compliance and foreign key constraints

### Why SQLite is Still Supported

- **Zero Setup:** No database server installation required
- **Perfect for Development:** Fast, simple, local
- **Great for Demos:** Single-file database
- **Edge Deployment:** Works in some edge environments

### Migration Path

Switching databases is trivial with Prisma:

```bash
# From SQLite to PostgreSQL
1. Update DATABASE_URL in .env
2. Update provider in prisma/schema.prisma
3. Run: npm run db:migrate
```

**See:** [Database Setup Guide](database-setup.md)

---

## Relay over Apollo/URQL

**Decision:** Use Relay as the GraphQL client instead of Apollo Client or URQL.

### Why Relay?

1. **Performance:**
   - Normalized cache with automatic garbage collection
   - Request deduplication and batching
   - Compile-time query optimization
   - Smaller runtime bundle size

2. **Type Safety:**
   - Generated TypeScript types from GraphQL schema
   - Compile-time query validation
   - No runtime errors from typos in queries

3. **Best Practices Enforcement:**
   - Forces proper GraphQL patterns (fragments, connections)
   - Prevents over-fetching
   - Encourages colocation of data requirements

4. **Proven at Scale:**
   - Powers Facebook/Meta applications
   - Battle-tested with billions of users

### Tradeoffs

- **Steeper Learning Curve:** More concepts to learn (fragments, connections)
- **Requires Compiler:** Build step needed (automated via Nx)
- **Opinionated:** Less flexible than Apollo

### Comparison

| Feature | Relay | Apollo | URQL |
|---------|-------|--------|------|
| **Bundle Size** | ~40KB | ~130KB | ~25KB |
| **Type Safety** | Compile-time | Runtime (codegen optional) | Runtime (codegen optional) |
| **Caching** | Normalized (automatic) | Normalized (manual) | Document (simpler) |
| **Learning Curve** | Steep | Moderate | Easy |
| **Compile Step** | Required | Optional | Optional |
| **Performance** | Excellent | Good | Good |

**When to use Apollo instead:** If you need maximum flexibility and don't want the compiler step.

---

## Nx Monorepo Structure

**Decision:** Use Nx to manage the monorepo instead of Turborepo or pnpm workspaces.

### Why Nx?

1. **Intelligent Caching:**
   - Computation caching across local and CI
   - Task orchestration with dependency awareness
   - Remote caching support

2. **Code Generation:**
   - Automatic Relay artifact generation on schema changes
   - Dependency graph awareness

3. **Enterprise-Grade:**
   - Used by Google, Microsoft, enterprise teams
   - Scales to hundreds of projects

4. **Developer Experience:**
   - `nx graph` - Visualize project dependencies
   - Affected command - Only test/build what changed
   - Plugin ecosystem for frameworks

### Structure

```
seed-web-stack/
├── apps/
│   ├── web/              # Next.js application
│   └── web-e2e/          # E2E tests
├── lib/                  # Shared libraries
│   ├── graphql/          # GraphQL schema & resolvers
│   ├── relay/            # Relay environment
│   └── prisma.ts         # Prisma client
└── nx.json               # Nx configuration
```

### Benefits Realized

- **Relay Compilation:** Nx automatically regenerates Relay artifacts when schema changes
- **Dependency Tracking:** Changes to `schema.graphql` trigger Relay compiler
- **Caching:** Build and test results cached across runs

---

## JWT Authentication

**Decision:** Use JWT tokens for stateless authentication instead of sessions.

### Why JWT?

1. **Stateless:**
   - No server-side session storage needed
   - Scales horizontally easily
   - Works with serverless/edge deployments

2. **Simple:**
   - No Redis/database session store required
   - Client holds the token
   - Easy to implement

3. **API-Friendly:**
   - Works naturally with GraphQL APIs
   - Easy to use from mobile apps
   - Standard Authorization header

### Implementation

```typescript
// Sign token on login/register
const token = jwt.sign({ userId: user.id }, JWT_SECRET);

// Verify in GraphQL context
const decoded = jwt.verify(token, JWT_SECRET);
return { userId: decoded.userId };
```

### Security Considerations

- **Token Storage:** Stored in localStorage (acceptable for non-sensitive apps)
- **For High Security:** Use httpOnly cookies instead
- **JWT_SECRET:** Must be strong and secret (never commit)
- **No Expiration:** Currently tokens don't expire (add `expiresIn` for production)

### When to Use Sessions Instead

- Banking/financial applications
- Need real-time token revocation
- Regulatory compliance requirements

---

## Direct Environment Variable Loading

**Decision:** Load root `.env` file directly in `next.config.js` using dotenv.

### Why This Approach?

Next.js by default only loads `.env` files from the app directory. In a monorepo:

```
seed-web-stack/
├── .env                 # Root environment variables
└── apps/
    └── web/
        └── .env.local   # Next.js would look here
```

### Solution

```javascript
// apps/web/next.config.js
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
```

### Benefits

1. **Single Source of Truth:** One `.env` file for the entire monorepo
2. **Shared Configuration:** Database URL, secrets available everywhere
3. **Simpler Development:** No need to duplicate environment variables

### Alternative Approaches (Not Used)

- **Nx env plugin:** Adds complexity for minimal benefit
- **Duplicate .env files:** Violates DRY principle
- **Turbo env vars:** Would require switching to Turborepo

---

## Database Verification on Startup

**Decision:** Verify database connection when GraphQL API route loads, not as a pre-script.

### Why This Approach?

```typescript
// apps/web/app/api/graphql/route.ts
import { verifyDatabaseConnection } from '../../../../../lib/verify-db';

// Verify on module load
verifyDatabaseConnection()
  .then(() => console.log('✅ Database connection successful'))
  .catch((error) => console.error('❌ Database connection failed'));
```

### Benefits

1. **Built-in:** Part of the application, not external script
2. **Lazy Loading:** Only runs when API is first accessed
3. **Better DX:** See verification in server logs naturally
4. **No Extra Script:** Simplified package.json scripts

### Alternative (Not Used)

```json
"dev": "node scripts/verify-db.js && nx dev seed-web-stack-web"
```

This adds startup latency and an extra script to maintain.

---

## Future Considerations

### Potential Improvements

1. **Authentication:**
   - Add refresh tokens for better security
   - Implement token expiration
   - Add password reset flow

2. **Database:**
   - Add connection pooling for production
   - Implement database seeding scripts
   - Add backup/restore documentation

3. **GraphQL:**
   - Add persisted queries for performance
   - Implement DataLoader for N+1 prevention
   - Add pagination helpers

4. **Testing:**
   - Add integration tests for GraphQL API
   - Set up Playwright E2E test examples
   - Add visual regression testing

5. **Deployment:**
   - Add Docker configuration
   - Document Vercel/Railway deployment
   - Set up CI/CD examples

---

## Questions?

For implementation details, see:
- [Technical Architecture](tech.md)
- [Database Setup](database-setup.md)
- [Project Structure](structure.md)
