# Product Documentation

This document describes the Seed Web Stack from a product and feature perspective, covering what it does, who it's for, and how to use it.

## Overview

**Seed Web Stack** is a production-ready full-stack web application starter template designed to accelerate the development of modern web applications with authentication and user management.

### What is it?

A **monorepo boilerplate** that provides:
- Complete authentication system (login, registration)
- GraphQL API with type-safe client
- Modern UI with Tailwind CSS
- Database with ORM
- Testing setup
- Monorepo tooling
- Best practices and patterns

### Who is it for?

- **Developers** starting new web applications
- **Startups** needing a solid foundation quickly
- **Teams** wanting modern tooling and best practices
- **Engineers** learning modern web development
- **Projects** requiring authentication from day one

### Use Cases

✅ SaaS applications
✅ Internal tools and dashboards
✅ Customer portals
✅ Content management systems
✅ E-commerce platforms
✅ Social applications
✅ API-first applications

## Core Features

### 1. User Authentication

#### Registration
- Email-based account creation
- Password strength requirements (implement as needed)
- Unique email validation
- Automatic account creation
- JWT token generation
- Immediate login after registration

**User Flow**:
1. Navigate to `/auth/register`
2. Enter email, password, and name (optional)
3. Click "Register"
4. System validates email uniqueness
5. Password is hashed and stored
6. JWT token is generated
7. User is logged in automatically
8. Redirect to dashboard

**API**:
```graphql
mutation Register {
  register(
    email: "user@example.com"
    password: "securePassword123"
    name: "John Doe"
  ) {
    token
    user {
      id
      email
      name
      createdAt
    }
  }
}
```

#### Login
- Email and password authentication
- Secure password verification
- JWT token issuance
- Persistent sessions (via localStorage)
- Error handling for invalid credentials

**User Flow**:
1. Navigate to `/auth/login`
2. Enter email and password
3. Click "Login"
4. System verifies credentials
5. JWT token is generated
6. Token stored in browser
7. Redirect to dashboard

**API**:
```graphql
mutation Login {
  login(
    email: "user@example.com"
    password: "securePassword123"
  ) {
    token
    user {
      id
      email
      name
    }
  }
}
```

#### Session Management
- Token-based authentication
- Automatic token inclusion in requests
- Logout capability (clear localStorage)
- Session persistence across browser refreshes

### 2. Protected Routes

#### Dashboard
- Requires authentication
- Displays user information
- Fetches data via GraphQL
- Shows welcome message with user's name

**User Experience**:
- Logged-in users see their dashboard
- Displays: "Welcome, [Name]!"
- Shows user email and account info
- Includes logout button

**Access Control**:
- Unauthenticated users should be redirected (implement as needed)
- Token validated on server for each request
- Stale tokens rejected

### 3. User Profile

#### Current User Query
- Fetch authenticated user's data
- Type-safe GraphQL queries
- Automatic caching via Relay

**API**:
```graphql
query CurrentUser {
  viewer {
    id
    email
    name
    createdAt
  }
}
```

**Alternative**:
```graphql
query Me {
  me {
    id
    email
    name
  }
}
```

Note: Both `viewer` and `me` queries return the current authenticated user.

### 4. GraphQL API

#### Endpoint
- **URL**: `http://localhost:4200/api/graphql`
- **Method**: POST
- **Content-Type**: application/json

#### GraphiQL Playground
- Built-in API explorer
- Available at `/api/graphql` in browser
- Interactive documentation
- Query testing interface

**Features**:
- Auto-complete for queries
- Schema documentation
- Real-time validation
- Execute queries directly

#### Available Operations

**Queries**:
- `viewer` - Get current user
- `me` - Get current user (alias)

**Mutations**:
- `register` - Create new account
- `login` - Authenticate user

### 5. Database

#### User Model
```
User {
  id: UUID (auto-generated)
  email: String (unique, required)
  password: String (hashed, required)
  name: String (optional)
  createdAt: DateTime (auto)
  updatedAt: DateTime (auto)
}
```

#### Database Features
- SQLite by default (easy development)
- Switchable to PostgreSQL/MySQL (production)
- Automatic migrations
- Type-safe queries
- Visual database browser (Prisma Studio)

**Accessing Database**:
```bash
npx prisma studio
```
Opens GUI at `http://localhost:5555`

### 6. UI/UX

#### Pages

**Home** (`/`)
- Welcome message
- Links to Login and Register
- Simple, clean design

**Login** (`/auth/login`)
- Email input
- Password input
- Submit button
- Link to registration

**Register** (`/auth/register`)
- Email input
- Password input
- Name input (optional)
- Submit button
- Link to login

**Dashboard** (`/dashboard`)
- User welcome message
- Profile information
- Logout button

#### Design System
- Tailwind CSS utility classes
- Responsive design
- Accessible components
- Consistent styling
- Clean, modern aesthetic

**Color Scheme**:
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Background: Gray (#F3F4F6)
- Text: Dark Gray (#1F2937)

## User Workflows

### First-Time User Journey

1. **Arrive at Home Page**
   - See welcome message
   - Two options: Login or Register

2. **Choose Registration**
   - Click "Register" button
   - Navigate to `/auth/register`

3. **Create Account**
   - Fill in email (e.g., `alice@example.com`)
   - Enter password
   - Optionally enter name
   - Click "Register"

4. **Auto-Login**
   - System creates account
   - Generates JWT token
   - Stores token in browser
   - Redirects to dashboard

5. **View Dashboard**
   - See personalized welcome
   - View profile information
   - Access protected features

### Returning User Journey

1. **Arrive at Home Page**
   - See welcome message
   - Click "Login"

2. **Authenticate**
   - Enter email and password
   - Click "Login"

3. **Access Dashboard**
   - Token validated
   - Redirected to dashboard
   - Session persists

### Logout Flow

1. **Click Logout**
   - Token removed from localStorage
   - Redirect to home page
   - Protected routes inaccessible

## API Usage Examples

### Client-Side Usage (React)

```typescript
import { graphql } from 'relay-runtime';
import { useMutation } from 'react-relay';

function LoginForm() {
  const [login, isLoading] = useMutation(graphql`
    mutation LoginMutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user { id email name }
      }
    }
  `);

  const handleSubmit = (email: string, password: string) => {
    login({
      variables: { email, password },
      onCompleted: (data) => {
        localStorage.setItem('token', data.login.token);
        window.location.href = '/dashboard';
      },
      onError: (error) => {
        console.error('Login failed:', error);
      }
    });
  };

  // ... render form
}
```

### External API Usage (curl)

**Register**:
```bash
curl -X POST http://localhost:4200/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { register(email: \"test@example.com\", password: \"pass123\", name: \"Test User\") { token user { id email } } }"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:4200/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(email: \"test@example.com\", password: \"pass123\") { token user { id } } }"
  }'
```

**Get Current User**:
```bash
curl -X POST http://localhost:4200/api/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "query": "query { viewer { id email name createdAt } }"
  }'
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | Database connection string | `file:./dev.db` | Yes |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-change-in-production` | Yes |
| `NODE_ENV` | Environment mode | `development` | No |

### Customization

#### Change Database
Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // or "mysql", "sqlite"
  url      = env("DATABASE_URL")
}
```

#### Change Port
Edit `apps/web/project.json`:
```json
{
  "targets": {
    "serve": {
      "options": {
        "port": 3000  // Change from 4200
      }
    }
  }
}
```

#### Customize Styling
Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color'
      }
    }
  }
}
```

## Security Features

### Implemented

✅ **Password Hashing**
- bcrypt with 10 salt rounds
- Never stores plaintext passwords

✅ **JWT Authentication**
- Token-based sessions
- Stateless authentication
- Secure token generation

✅ **Input Validation**
- GraphQL schema validation
- Type checking
- Required field enforcement

✅ **Unique Constraints**
- Email uniqueness enforced at database level
- Prevents duplicate accounts

✅ **Error Handling**
- Generic error messages (prevents user enumeration)
- Proper error codes
- Secure error responses

### Production Recommendations

For production deployment, consider adding:

- [ ] **HTTPS Only** - Enforce SSL/TLS
- [ ] **Rate Limiting** - Prevent brute force attacks
- [ ] **Token Expiration** - JWT expires after X hours
- [ ] **Refresh Tokens** - Long-lived refresh mechanism
- [ ] **CSRF Protection** - Cross-site request forgery prevention
- [ ] **CORS Configuration** - Restrict allowed origins
- [ ] **Input Sanitization** - XSS prevention
- [ ] **Password Requirements** - Minimum length, complexity
- [ ] **Email Verification** - Confirm email addresses
- [ ] **Two-Factor Auth** - Additional security layer
- [ ] **Audit Logging** - Track user actions
- [ ] **Session Invalidation** - Logout all devices
- [ ] **Database Backups** - Regular automated backups

## Extending the Application

### Adding New Features

#### Example: User Profile Update

1. **Update Database Schema** (`prisma/schema.prisma`):
```prisma
model User {
  // ... existing fields
  bio       String?
  avatarUrl String?
}
```

2. **Create Migration**:
```bash
npx prisma migrate dev --name add_user_profile
```

3. **Update GraphQL Schema** (`lib/graphql/schema.ts`):
```graphql
type User {
  # ... existing fields
  bio: String
  avatarUrl: String
}

type Mutation {
  updateProfile(bio: String, avatarUrl: String): User!
}
```

4. **Add Resolver**:
```typescript
Mutation: {
  updateProfile: async (_, { bio, avatarUrl }, context) => {
    if (!context.userId) throw new Error('Not authenticated');
    return prisma.user.update({
      where: { id: context.userId },
      data: { bio, avatarUrl }
    });
  }
}
```

5. **Update `schema.graphql`** and run `npm run relay`

6. **Create UI Component** in `apps/web/app/profile/page.tsx`

### Common Extensions

**User Roles**:
- Add `role` field to User model
- Implement role-based access control
- Add admin dashboard

**Social Login**:
- Integrate OAuth providers (Google, GitHub)
- Add OAuth mutation resolvers
- Update UI with social buttons

**Email Notifications**:
- Add email service (SendGrid, Mailgun)
- Send welcome emails
- Password reset emails

**File Uploads**:
- Add file upload resolver
- Store files (S3, Cloudinary)
- Add avatar upload

## Monitoring and Analytics

### Development Tools

**Prisma Studio**:
```bash
npx prisma studio
```
- View and edit database records
- Test queries
- Debug data issues

**GraphiQL Playground**:
- Navigate to `/api/graphql`
- Test API queries
- View schema documentation

**Nx Graph**:
```bash
npx nx graph
```
- Visualize project dependencies
- Understand architecture
- Optimize builds

### Logging

Currently logs to console. For production, consider:
- Structured logging (Winston, Pino)
- Log aggregation (LogRocket, Sentry)
- Error tracking
- Performance monitoring

## Performance

### Current Optimizations

✅ **Relay Caching**
- Automatic query deduplication
- Normalized cache
- Efficient re-renders

✅ **Next.js Optimizations**
- Automatic code splitting
- Image optimization
- Font optimization

✅ **Database Indexing**
- Email field indexed (unique constraint)
- Fast lookups

### Future Optimizations

- [ ] Add Redis for caching
- [ ] Implement database connection pooling
- [ ] Add CDN for static assets
- [ ] Enable incremental static regeneration
- [ ] Implement lazy loading

## Troubleshooting

### Common Issues

**Problem**: Can't login after registration
**Solution**: Check that JWT token is being stored in localStorage

**Problem**: GraphQL queries fail
**Solution**: Ensure `npm run relay` was run after schema changes

**Problem**: Database errors
**Solution**: Run `npx prisma generate` and `npx prisma migrate dev`

**Problem**: Port 4200 already in use
**Solution**: Kill the process or change port in configuration

**Problem**: Token expired errors
**Solution**: Tokens don't expire by default; check JWT_SECRET is correct

## Best Practices

### For Users

1. **Use Strong Passwords** - Mix of letters, numbers, symbols
2. **Unique Email** - One account per email
3. **Logout When Done** - Clear session on shared devices
4. **Keep Token Safe** - Don't share JWT tokens

### For Developers

1. **Run Relay Compiler** - After every GraphQL schema change
2. **Commit Migrations** - Version control database changes
3. **Use Type Safety** - Leverage TypeScript fully
4. **Test Thoroughly** - Write unit and E2E tests
5. **Follow Conventions** - Keep consistent code style
6. **Document Changes** - Update docs when adding features

## Support and Resources

### Documentation
- [README.md](../README.md) - Quick start guide
- [docs/tech.md](tech.md) - Technical architecture
- [docs/structure.md](structure.md) - Project structure

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Relay Docs](https://relay.dev/)
- [Prisma Docs](https://www.prisma.io/docs)
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)

### Community
- GitHub Issues - Bug reports and features
- Discussions - Questions and ideas

## Roadmap

### Planned Features

- [ ] Email verification
- [ ] Password reset flow
- [ ] User profile pages
- [ ] Social authentication
- [ ] Two-factor authentication
- [ ] Admin dashboard
- [ ] User roles and permissions
- [ ] API rate limiting
- [ ] Comprehensive E2E tests
- [ ] Docker setup
- [ ] CI/CD pipelines
- [ ] Deployment guides

## License

MIT License - Free to use and modify for any purpose.
