# Booklin API

Backend API for the Booklin platform - A marketplace for home service professionals.

## 🏗️ Architecture

This project uses **hexagonal architecture** (ports & adapters) with **dependency injection**.

### Structure

```
src/
├── core/              # Business domain (business logic)
├── adapters/          # Adapters (HTTP, DB, etc.)
└── shared/            # Configuration & DI
```

📚 **Detailed Documentation**:
- [Hexagonal Architecture](../../docs/en/api/architecture/hexagonal-architecture.md) - Structure and patterns
- [Architecture Summary](../../docs/en/api/architecture/architecture-summary.md) - Visual summary
- [Configuration](../../docs/en/api/guides/configuration.md) - Environment variables, CORS, middlewares
- [Validation Guide](../../docs/en/api/guides/validation.md) - HTTP validation with Zod
- [Path Aliases Guide](../../docs/en/api/guides/path-aliases.md) - Using @/ imports
- [Prisma Location Guide](../../docs/en/api/guides/prisma-location.md) - Prisma in hexagonal architecture
- [User Module Migration](../../docs/en/api/migrations/user-module.md) - Migration summary
- [ProProfile Module Migration](../../docs/en/api/migrations/proprofile-module.md) - ProProfile migration

## 🚀 Quick Start

### 1. Installation

```bash
pnpm install
```

### 2. Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in the required variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/booklin_db
```

### 3. Database

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# (Optional) Open Prisma Studio
pnpm prisma studio
```

### 4. Start the server

```bash
pnpm dev
```

The API will be accessible at `http://localhost:4000`

## 📡 Endpoints

### Health Check
```bash
GET /health
```

### Users (Hexagonal Architecture)
```bash
POST   /api/users                    # Create user
PATCH  /api/users/:clerkId          # Update
DELETE /api/users/:clerkId          # Delete
GET    /api/users/clerk/:clerkId    # By ClerkId
GET    /api/users/id/:id            # By ID
GET    /api/users/email/:email      # By Email
GET    /api/users                   # List
```

### Webhooks
```bash
POST /api/webhooks/clerk            # Clerk webhooks
```

### Pro Profiles (Hexagonal Architecture)
```bash
POST   /api/pro-profiles                      # Create pro profile
PATCH  /api/pro-profiles/:id                  # Update
DELETE /api/pro-profiles/:id                  # Delete
GET    /api/pro-profiles/:id                  # By ID
GET    /api/pro-profiles/user/:userId         # By User ID
GET    /api/pro-profiles                      # List (with filters)

# Approval
POST   /api/pro-profiles/:id/approve          # Approve (admin)
POST   /api/pro-profiles/:id/reject           # Reject (admin)

# Premium
POST   /api/pro-profiles/:id/premium/activate      # Activate premium
POST   /api/pro-profiles/:id/premium/renew         # Renew premium
POST   /api/pro-profiles/:id/premium/deactivate    # Deactivate premium
```

## 🧪 Tests

```bash
# Unit tests
pnpm test

# Tests with coverage
pnpm test:coverage

# Tests in watch mode
pnpm test:watch
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **DI**: TSyringe
- **Auth**: Clerk
- **Payments**: Stripe

## 📦 Available Scripts

```bash
pnpm dev          # Start in development mode
pnpm build        # Production build
pnpm start        # Start in production
pnpm lint         # Lint code
pnpm format       # Format code
pnpm prisma       # Prisma commands
```

## 🔑 Architecture Principles

### ✅ What belongs in the domain (`core/`)
- Rich business entities
- Business rules
- Use Cases (interfaces)
- Value Objects

### ❌ What does NOT belong in the domain
- Prisma, Express, HTTP
- Infrastructure details
- Technical configuration

### 🎯 Typical Flow

```
HTTP Request
    ↓
Route → Controller (adapter IN)
    ↓
Use Case (port IN)
    ↓
Service (implementation)
    ↓
Repository (port OUT)
    ↓
Prisma Repository (adapter OUT)
    ↓
Database
```

## 📝 Conventions

### Commits
```
feat: add user profile endpoint
fix: resolve booking date validation
chore: update dependencies
docs: update API documentation
```

### Naming
- **Files**: PascalCase for components, camelCase for utils
- **Classes**: PascalCase
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces**: PascalCase without `I` prefix

## 🤝 Contribution

1. Create a branch: `git checkout -b feat/my-feature`
2. Commit: `git commit -m "feat: add feature"`
3. Push: `git push origin feat/my-feature`
4. Create a Pull Request

## 📚 Resources

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://khalilstemmler.com/articles/domain-driven-design-intro/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

## 📄 License

Proprietary - Booklin © 2025
