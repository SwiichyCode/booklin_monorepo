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

- ✅ **Hexagonal Architecture** with dependency injection (TSyringe)
- ✅ **User Management** (Clerk authentication + custom user system)
- ✅ **Professional Profiles** with onboarding flow
- ✅ **PostgreSQL Database** with Prisma ORM
- ✅ **Type-safe API** with TypeScript strict mode
- ✅ **Monorepo** with Turborepo for optimal performance

### Roadmap

See [CLAUDE.md](./CLAUDE.md) for detailed roadmap and business model.

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
│   ├── web/                    # Next.js frontend
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   └── lib/               # Utils & helpers
│   │
│   └── api/                    # Express backend (Hexagonal Architecture)
│       ├── src/
│       │   ├── core/          # Domain logic (business rules)
│       │   ├── adapters/      # Infrastructure (HTTP, DB, etc.)
│       │   └── shared/        # Config & DI
│       │
│       ├── prisma/            # Database schema & migrations
│       ├── documentation/     # Architecture & guides
│       └── README.md          # API documentation
│
├── packages/                   # Shared packages
│   └── typescript-config/     # Shared TS configs
│
├── turbo.json
├── CLAUDE.md                   # Project context & guidelines
└── README.md                   # This file
```

**📚 For detailed API architecture**, see [apps/api/README.md](./apps/api/README.md)

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
- **[Migration Complete](./apps/api/documentation/MIGRATION_COMPLETE.md)** - Migration summary

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
