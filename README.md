# 🏠 Booklin - Home Services Marketplace

> **Version**: 0.1.0 (MVP in development)
> **Last Update**: October 2025

Marketplace SaaS connecting home service professionals (hairdressers, barbers, massage therapists, etc.) with individual clients via a **subscription model** (no commission on services).

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Architecture](#-architecture)
- [Database](#-database)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

### Problem We're Solving

- **For Professionals**: Competitors like Wecasa take 25% commission → **Our solution**: Fixed €49/month subscription, they keep 100% of their revenue
- **For Clients**: Hard to find trusted professionals nearby → **Our solution**: Centralized platform with verified reviews

### Key Differentiators vs Wecasa

1. **Business Model**: Monthly subscription instead of 25% commission
2. **Pro Selection**: Client chooses their professional from the first booking
3. **Human Support**: Customer service accessible by phone
4. **Quality Selection**: Strict vetting of professionals

---

## ✨ Key Features

### Current (MVP)

- ✅ User authentication via Clerk
- ✅ Webhook integration for user synchronization
- ✅ PostgreSQL database with Prisma ORM
- ✅ Clean architecture (Service/Repository pattern)
- ✅ TypeScript strict mode
- ✅ Monorepo structure with Turborepo

### Roadmap (Phase 1 - Next 2-3 months)

- [ ] Professional profile creation and public display
- [ ] Service catalog management
- [ ] Basic booking system
- [ ] In-app messaging
- [ ] Review system
- [ ] Availability calendar
- [ ] Search and filtering

---

## 🛠 Tech Stack

### Frontend (`apps/web`)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **Authentication**: Clerk

### Backend (`apps/api`)

- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Clerk (webhook-based)

### Infrastructure

- **Monorepo**: Turborepo + pnpm workspaces
- **Package Manager**: pnpm
- **Payments**: Stripe (planned)
- **Images**: Cloudinary (planned)
- **Emails**: SendGrid (planned)
- **Maps**: Google Maps API (planned)
- **Deployment**: Vercel (frontend) + Railway (backend, planned)

---

## 📁 Project Structure

```
booklin_monorepo/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/                      # App Router pages
│   │   ├── components/               # React components
│   │   ├── lib/                      # Utils & helpers
│   │   └── public/                   # Static assets
│   │
│   └── api/                          # Express backend
│       ├── prisma/
│       │   ├── schema.prisma         # Database schema
│       │   └── migrations/           # Database migrations
│       └── src/
│           ├── modules/              # Feature modules
│           │   ├── users/            # User management
│           │   │   ├── user.service.ts
│           │   │   ├── user.repository.ts
│           │   │   ├── user.types.ts
│           │   │   └── index.ts
│           │   └── webhooks/         # Webhook handlers
│           │       ├── clerk/        # Clerk webhook logic
│           │       │   ├── clerk.webhook.controller.ts
│           │       │   ├── clerk.webhook.service.ts
│           │       │   └── clerk.webhook.types.ts
│           │       └── webhooks.routes.ts
│           ├── middlewares/          # Express middlewares
│           │   ├── auth.ts           # Clerk authentication
│           │   ├── errorHandler.ts   # Global error handler
│           │   └── verifyWebhook.ts  # Webhook signature verification
│           ├── routes/               # Route aggregation
│           ├── config/               # Configuration
│           ├── lib/                  # Utilities
│           └── server.ts             # Entry point
│
├── packages/                         # Shared packages (future)
│   ├── types/                        # Shared TypeScript types
│   ├── ui/                           # Shared components
│   └── config/                       # Shared configs
│
├── turbo.json                        # Turborepo configuration
├── package.json                      # Root dependencies
├── CLAUDE.md                         # Detailed project documentation
└── README.md                         # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18.x
- **pnpm**: >= 8.x
- **PostgreSQL**: >= 14.x
- **Clerk Account**: For authentication ([clerk.com](https://clerk.com))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd booklin_monorepo

# Install dependencies
pnpm install

# Setup environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Configure your .env files with proper values
```

### Database Setup

```bash
# Generate Prisma client
pnpm --filter=api prisma generate

# Run migrations
pnpm --filter=api prisma migrate dev

# (Optional) Open Prisma Studio to view data
pnpm --filter=api prisma studio
```

### Start Development Servers

```bash
# Start both frontend and backend
pnpm dev

# Or start individually
pnpm dev --filter=web      # Frontend only (http://localhost:3000)
pnpm dev --filter=api      # Backend only (http://localhost:4000)
```

---

## 💻 Development

### Available Scripts

```bash
# Development
pnpm dev                           # Start all apps in dev mode
pnpm dev --filter=web              # Start frontend only
pnpm dev --filter=api              # Start backend only

# Build
pnpm build                         # Build all apps
pnpm build --filter=web            # Build frontend only
pnpm build --filter=api            # Build backend only

# Database (Prisma)
pnpm --filter=api prisma generate  # Generate Prisma client
pnpm --filter=api prisma migrate dev --name <migration_name>
pnpm --filter=api prisma studio    # Open Prisma Studio GUI

# Code Quality
pnpm lint                          # Run ESLint
pnpm format                        # Run Prettier

# TypeScript
pnpm --filter=api tsc --noEmit     # Type check backend
pnpm --filter=web tsc --noEmit     # Type check frontend

# Dependencies
pnpm --filter=web add <package>    # Add to frontend
pnpm --filter=api add <package>    # Add to backend
pnpm add -D -w <package>           # Add dev dependency to root
```

### Code Style & Conventions

#### File Naming

- **Components**: `PascalCase.tsx` (e.g., `ProCard.tsx`)
- **Utils**: `camelCase.ts` (e.g., `formatDate.ts`)
- **API Routes**: `kebab-case.ts` (e.g., `user.controller.ts`)

#### Variable Naming

- **Variables/Functions**: `camelCase`
- **Components/Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`

#### API Response Format

```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: "Error message" }
```

---

## 🏗 Architecture

### Backend Architecture Pattern

We follow a **clean layered architecture** with dependency injection:

```
Controller → Service → Repository → Database
```

#### Example: User Module

```typescript
// 1. Controller - HTTP handling
UserController → handles Express requests/responses

// 2. Service - Business logic
UserService → validation, data transformation, business rules

// 3. Repository - Data access
UserRepository → Prisma queries (CRUD operations)

// 4. Database
PostgreSQL via Prisma
```

#### Benefits

- **Testability**: Easy to mock dependencies
- **Separation of Concerns**: Each layer has a single responsibility
- **Reusability**: Services can be used across different controllers
- **Maintainability**: Changes in one layer don't affect others

### Module Structure Example

```typescript
// modules/users/
user.service.ts      // Business logic
user.repository.ts   // Data access (Prisma)
user.types.ts        // TypeScript interfaces & DTOs
index.ts             // Public exports

// Usage in other modules
import { UserService } from '../users';
const userService = new UserService();
```

### Webhook Architecture

Webhooks are organized by provider for scalability:

```
modules/webhooks/
├── clerk/                    # Clerk-specific logic
│   ├── clerk.webhook.controller.ts
│   ├── clerk.webhook.service.ts
│   └── clerk.webhook.types.ts
├── stripe/                   # (Future) Stripe webhooks
└── webhooks.routes.ts        # Routes aggregation
```

---

## 💾 Database

### Schema Overview

#### Core Models

- **User**: Base user model (CLIENT or PRO)
- **ProProfile**: Professional profile extension
- **Service**: Services offered by professionals
- **Booking**: Service reservations
- **Review**: Client reviews for completed bookings
- **Conversation & Message**: In-app messaging

#### Key Relationships

```
User (CLIENT) ──┬── Booking (as client)
                └── Review (as client)
                └── Message (as sender)

User (PRO) ──── ProProfile ──┬── Service
                             ├── Booking (as pro)
                             ├── Review (received)
                             └── Availability
```

### Enums

```typescript
enum UserRole {
  CLIENT,
  PRO
}

enum BookingStatus {
  PENDING,
  CONFIRMED,
  CANCELLED,
  COMPLETED
}
```

### Prisma Commands

```bash
# Generate client after schema changes
pnpm --filter=api prisma generate

# Create and apply migration
pnpm --filter=api prisma migrate dev --name <migration_name>

# Apply migrations in production
pnpm --filter=api prisma migrate deploy

# Reset database (WARNING: deletes all data)
pnpm --filter=api prisma migrate reset

# Seed database (if seed file exists)
pnpm --filter=api prisma db seed

# View data in GUI
pnpm --filter=api prisma studio
```

---

## 📡 API Documentation

### Base URL

- **Development**: `http://localhost:4000/api`
- **Production**: TBD

### Current Endpoints

#### Webhooks

```
POST /api/webhooks/clerk
```

Receives Clerk authentication events (user.created, user.updated, user.deleted).

**Headers:**
- `svix-id`: Webhook ID
- `svix-timestamp`: Webhook timestamp
- `svix-signature`: Webhook signature (verified via Svix)

**Events:**
- `user.created`: Creates user in database
- `user.updated`: Updates user information
- `user.deleted`: Deletes user from database

### Future Endpoints (Planned)

```
# Users
GET    /api/users/:id          # Get user by ID
PATCH  /api/users/:id          # Update user

# Professional Profiles
GET    /api/pros               # List all professionals
GET    /api/pros/:id           # Get professional details
POST   /api/pros               # Create professional profile
PATCH  /api/pros/:id           # Update professional profile

# Services
GET    /api/pros/:proId/services           # List services
POST   /api/pros/:proId/services           # Create service
PATCH  /api/pros/:proId/services/:id       # Update service
DELETE /api/pros/:proId/services/:id       # Delete service

# Bookings
GET    /api/bookings                       # List user's bookings
POST   /api/bookings                       # Create booking
PATCH  /api/bookings/:id                   # Update booking
DELETE /api/bookings/:id                   # Cancel booking

# Reviews
GET    /api/pros/:proId/reviews            # Get pro's reviews
POST   /api/reviews                        # Create review

# Messages
GET    /api/conversations                  # List conversations
GET    /api/conversations/:id/messages     # Get messages
POST   /api/conversations/:id/messages     # Send message
```

---

## 🔐 Environment Variables

### Frontend (`apps/web/.env.local`)

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Future integrations
NEXT_PUBLIC_GOOGLE_MAPS_KEY=...
```

### Backend (`apps/api/.env`)

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/booklin?schema=public"

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Getting Clerk Credentials

1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Get publishable and secret keys from dashboard
4. For webhooks:
   - Go to Webhooks section
   - Create webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy webhook secret

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
# Deploy to Vercel
vercel

# Or connect GitHub repo for automatic deployments
```

**Environment Variables to Set:**
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### Backend (Railway/Render)

```bash
# Build command
pnpm --filter=api build

# Start command
pnpm --filter=api start
```

**Environment Variables to Set:**
- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `ALLOWED_ORIGINS`
- `NODE_ENV=production`

**Post-deployment:**
1. Run migrations: `pnpm --filter=api prisma migrate deploy`
2. Configure Clerk webhook URL to production endpoint

---

## 🤝 Contributing

### Branching Strategy

```bash
main              # Production-ready code
├── develop       # Integration branch
    ├── feat/user-profile
    ├── feat/booking-system
    └── fix/webhook-error
```

### Commit Convention

```
feat: add user profile page
fix: resolve booking date bug
refactor: restructure webhook module
chore: update dependencies
docs: update README
test: add user service tests
```

### Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Ensure `pnpm build` passes
4. Ensure `pnpm lint` passes
5. Create PR with clear description
6. Request review
7. Merge after approval

### Before Committing

- [ ] Code compiles without TypeScript errors
- [ ] No console.log left (unless intentional)
- [ ] No sensitive data in code
- [ ] `pnpm lint` passes
- [ ] `pnpm build` works

---

## 📚 Additional Resources

### Documentation

- [CLAUDE.md](./CLAUDE.md) - Detailed project context and guidelines
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)

### Useful Commands

```bash
# Check which apps will be affected by changes
turbo run build --dry-run

# Clear Turbo cache
turbo run build --force

# Check dependency graph
turbo run build --graph

# Run task in parallel
turbo run lint build test --parallel
```

---

## 📞 Support & Contact

- **Issues**: Create an issue on GitHub
- **Discussions**: GitHub Discussions
- **Documentation**: See `CLAUDE.md` for detailed context

---

## 📝 License

[To be defined]

---

**Built with ❤️ by the Booklin team**
