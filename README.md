# 🏠 Booklin - Home Services Marketplace

<div align="center">

**📖 Documentation:** [🇬🇧 English](./docs/en/README.md) | [🇫🇷 Français](./docs/fr/README.md)

</div>

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
- [📖 Complete Documentation](./docs/en/README.md) - Full documentation hub
- [API Architecture](./docs/en/api/README.md) - Backend documentation
- [Hexagonal Architecture Guide](./docs/en/api/architecture/hexagonal-architecture.md) - Architecture patterns
- [Endpoints Package](./docs/en/packages/endpoints/README.md) - Centralized API routes

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

### 🌍 Available Languages

- **[🇬🇧 English Documentation](./docs/en/README.md)** - Complete English documentation
- **[🇫🇷 Documentation Française](./docs/fr/README.md)** - Documentation complète en français

### Quick Links

**API Documentation**
- [Getting Started](./docs/en/api/README.md) - Quick start guide
- [Hexagonal Architecture](./docs/en/api/architecture/hexagonal-architecture.md) - Architecture patterns and principles
- [Configuration Guide](./docs/en/api/guides/configuration.md) - Environment setup and configuration
- [Validation Guide](./docs/en/api/guides/validation.md) - HTTP validation with Zod

**Packages**
- [Endpoints Package](./docs/en/packages/endpoints/README.md) - Centralized API route definitions
- [Usage Examples](./docs/en/packages/endpoints/examples.md) - Complete integration examples

**Migrations**
- [User Module](./docs/en/api/migrations/user-module.md) - User module architecture migration
- [ProProfile Module](./docs/en/api/migrations/proprofile-module.md) - ProProfile module migration

### Project Context

- **[CLAUDE.md](./CLAUDE.md)** - Detailed project context and guidelines (private)

### Database

Database schema is defined in `apps/api/prisma/schema.prisma`. See the [API documentation](./docs/en/api/README.md) for details on:
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
