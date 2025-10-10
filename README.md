# 🏠 Booklin - Home Services Marketplace

> **Version**: 0.1.0 (MVP in development)
> **Last Update**: October 2025

Marketplace SaaS connecting home service professionals (hairdressers, barbers, massage therapists, etc.) with individual clients via a **subscription model** (no commission on services).

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Documentation](#-documentation)
- [Contributing](#-contributing)

---

## 🎯 Overview

**Booklin** is a modern home services marketplace that connects verified professionals with clients. The platform features a subscription-based business model, comprehensive professional profiles, and a streamlined booking system.

### What We're Building

- **Professional Marketplace**: Platform for home service professionals (hairdressers, barbers, massage therapists, etc.)
- **Client Platform**: Easy discovery and booking of trusted professionals
- **Subscription Model**: Alternative revenue model for service professionals
- **Quality Focus**: Verified profiles with authentic reviews

---

## ✨ Key Features

### Architecture & Infrastructure
- ✅ **Hexagonal Architecture** with dependency injection (TSyringe)
- ✅ **Monorepo** with Turborepo + pnpm workspaces
- ✅ **Centralized Endpoints** package for API route consistency
- ✅ **Type-safe API** with TypeScript strict mode
- ✅ **PostgreSQL Database** with Prisma ORM

### Authentication & User Management
- ✅ **Clerk Authentication** integration (webhooks + client SDK)
- ✅ **Custom User System** with role-based access
- ✅ **Webhook Synchronization** (Clerk events)

### Professional Features
- ✅ **Professional Profiles** with comprehensive onboarding flow
- ✅ **Multi-step Onboarding** with React Query state management
- ✅ **Profile Validation** system (pending/approved/rejected)
- ✅ **Premium Subscriptions** management

### Developer Experience
- ✅ **Component Library** with Shadcn/ui
- ✅ **Form Validation** with React Hook Form + Zod
- ✅ **API Documentation** with comprehensive guides
- ✅ **Shared Packages** (types, configs, endpoints)

### Roadmap

See [CLAUDE.md](./CLAUDE.md) for detailed roadmap.

---

## 🛠 Tech Stack

### Frontend (`apps/web`)

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Authentication**: Clerk

### Backend (`apps/api`)

- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Architecture**: Hexagonal (Ports & Adapters)
- **Dependency Injection**: TSyringe
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
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
│   ├── web/                    # Next.js frontend
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   │   ├── features/     # Feature-specific components
│   │   │   ├── layouts/      # Layout components
│   │   │   ├── shared/       # Shared components
│   │   │   └── ui/           # Base UI components (Shadcn)
│   │   ├── lib/               # Utils, hooks & API clients
│   │   └── stores/            # Zustand stores
│   │
│   └── api/                    # Express backend (Hexagonal Architecture)
│       ├── src/
│       │   ├── core/          # Domain logic (use cases, entities)
│       │   │   ├── domain/    # Domain entities & value objects
│       │   │   └── use-cases/ # Application business logic
│       │   ├── adapters/      # Infrastructure layer
│       │   │   ├── in/http/   # HTTP controllers & routes
│       │   │   └── out/       # Database repositories
│       │   └── shared/        # Config, DI, utilities
│       │
│       ├── prisma/            # Database schema & migrations
│       ├── documentation/     # Architecture & guides
│       └── README.md          # API documentation
│
├── packages/                   # Shared workspace packages
│   ├── endpoints/             # Centralized API route definitions
│   │   ├── lib/              # Types, config, helpers
│   │   └── endpoints/        # Route definitions by module
│   ├── typescript-config/     # Shared TypeScript configs
│   ├── eslint-config/         # Shared ESLint configs
│   ├── prettier-config/       # Shared Prettier config
│   └── ui/                    # Shared UI components (future)
│
├── turbo.json                  # Turborepo configuration
├── CLAUDE.md                   # Project context & guidelines
└── README.md                   # This file
```

**📚 For detailed architecture**, see:
- [API Architecture](./apps/api/README.md)
- [Hexagonal Architecture Guide](./apps/api/documentation/architecture/HEXAGONAL_ARCHITECTURE.md)
- [Endpoints Package](./packages/endpoints/README.md)

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
pnpm dev                           # Start all apps
pnpm dev --filter=web              # Frontend only
pnpm dev --filter=api              # Backend only

# Build
pnpm build                         # Build all apps

# Database (Prisma)
pnpm --filter=api prisma generate  # Generate client
pnpm --filter=api prisma migrate dev
pnpm --filter=api prisma studio    # Open GUI

# Code Quality
pnpm lint
pnpm format

# Add dependencies
pnpm --filter=web add <package>    # Frontend
pnpm --filter=api add <package>    # Backend
```

### Code Conventions

See [CLAUDE.md](./CLAUDE.md) for detailed conventions and best practices.

---

## 📚 Documentation

### API Documentation

For detailed API documentation, architecture, and configuration:

- **[apps/api/README.md](./apps/api/README.md)** - Getting started with the API
- **[Hexagonal Architecture](./apps/api/documentation/architecture/HEXAGONAL_ARCHITECTURE.md)** - Complete architecture guide
- **[Configuration Guide](./apps/api/documentation/CONFIGURATION.md)** - Environment variables, CORS, middlewares
- **[Architecture Summary](./apps/api/documentation/architecture/ARCHITECTURE_SUMMARY.md)** - Visual architecture summary
- **[Validation Guide](./apps/api/documentation/VALIDATION_GUIDE.md)** - HTTP validation with Zod
- **[Path Aliases Guide](./apps/api/documentation/PATH_ALIASES_GUIDE.md)** - Using @/ imports
- **[Prisma Location Guide](./apps/api/documentation/PRISMA_LOCATION_GUIDE.md)** - Prisma in hexagonal architecture
- **[Migration Complete](./apps/api/documentation/MIGRATION_COMPLETE.md)** - User module migration summary
- **[ProProfile Migration](./apps/api/documentation/PROPROFILE_MIGRATION.md)** - ProProfile module migration (NEW!)

### Project Context

- **[CLAUDE.md](./CLAUDE.md)** - Detailed project context, business model, and guidelines

### Database

Database schema is defined in `apps/api/prisma/schema.prisma`. See the API documentation for details on:
- Models (User, ProProfile, Booking, Review, etc.)
- Relationships
- Enums
- Migrations

---

## 🤝 Contributing

### Commit Convention

```
feat: add user profile page
fix: resolve booking date bug
refactor: restructure webhook module
chore: update dependencies
docs: update README
```

### Before Committing

- [ ] TypeScript compiles without errors
- [ ] `pnpm lint` passes
- [ ] `pnpm build` works
- [ ] No sensitive data in code

See [CLAUDE.md](./CLAUDE.md) for detailed contribution guidelines.

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

---

**Built with ❤️ by the Booklin team**
