# 📁 Placement Guide - Prisma in Hexagonal Architecture

## 🎯 Basic Principle

In hexagonal architecture, **Prisma is a persistence infrastructure** and therefore belongs to the **Adapters OUT** layer.

---

## 📂 Complete Structure

```
apps/api/
├── prisma/                              ← Schema & Migrations (API project root)
│   ├── schema.prisma                   ← Data schema definition
│   ├── migrations/                     ← Database migrations
│   └── seed.ts                         ← Seed script (optional)
│
├── src/
│   ├── core/                           ← DOMAIN (no Prisma here!)
│   │   ├── domain/
│   │   │   └── entities/
│   │   │       └── User.ts             ← Domain entity (no Prisma)
│   │   ├── ports/
│   │   │   └── out/
│   │   │       └── UserRepository.ts   ← Interface (no Prisma implementation)
│   │   └── services/
│   │       └── UserService.ts          ← Business logic (no Prisma)
│   │
│   ├── adapters/
│   │   └── out/
│   │       └── persistence/
│   │           └── prisma/             ← 🎯 ALL PRISMA GOES HERE
│   │               ├── client.ts       ← PrismaClient configuration
│   │               ├── index.ts        ← Public exports
│   │               ├── repositories/   ← Repository implementations
│   │               │   ├── PrismaUserRepository.ts
│   │               │   ├── PrismaBookingRepository.ts
│   │               │   └── ...
│   │               └── mappers/        ← Domain ↔ Prisma conversion
│   │                   ├── UserMapper.ts
│   │                   ├── BookingMapper.ts
│   │                   └── ...
│   │
│   └── shared/
│       ├── config/
│       │   └── env.ts                  ← Environment variables (DATABASE_URL)
│       └── di/
│           └── container.ts            ← PrismaClient registration
```

---

## 📝 File Details

### 1. **prisma/schema.prisma** (API root)
```prisma
// Data schema definition
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  clerkId   String   @unique
  email     String?
  role      Role     @default(CLIENT)
  // ...
}
```

### 2. **adapters/out/persistence/prisma/client.ts**
```typescript
// Centralized Prisma client configuration
import { PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient({
  log: ['query', 'error', 'warn'],
});
```

### 3. **adapters/out/persistence/prisma/repositories/PrismaUserRepository.ts**
```typescript
// Repository implementation for Prisma
import { injectable, inject } from 'tsyringe';
import type { UserRepository } from '../../../../core/ports/out/UserRepository';
import type { PrismaClient } from '@prisma/client';
import { UserMapper } from '../mappers/UserMapper';

@injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const data = UserMapper.toCreateData(user);
    const created = await this.prisma.user.create({ data });
    return UserMapper.toDomain(created);
  }
}
```

### 4. **adapters/out/persistence/prisma/mappers/UserMapper.ts**
```typescript
// Conversion between Domain Entity and Prisma types
import { User as PrismaUser } from '@prisma/client';
import { User } from '../../../../core/domain/entities/User';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    // Prisma → Domain
  }

  static toCreateData(user: User) {
    // Domain → Prisma
  }
}
```

### 5. **shared/di/container.ts**
```typescript
// PrismaClient registration in DI container
import { prismaClient } from '../../adapters/out/persistence/prisma/client';

export function setupContainer(): void {
  container.register('PrismaClient', {
    useValue: prismaClient,
  });
}
```

---

## 🚫 What NOT to Do

### ❌ Never import Prisma in the Core
```typescript
// ❌ BAD - core/services/UserService.ts
import { PrismaClient } from '@prisma/client'; // NO!

// ❌ BAD - core/domain/entities/User.ts
import { User as PrismaUser } from '@prisma/client'; // NO!
```

### ❌ Never use Prisma types in the Core
```typescript
// ❌ BAD
interface UserRepository {
  findById(id: string): Promise<PrismaUser>; // Prisma type exposed
}

// ✅ GOOD
interface UserRepository {
  findById(id: string): Promise<User>; // Domain type
}
```

### ❌ Never put business logic in repositories
```typescript
// ❌ BAD - Repository
async updateUser(id: string, data: any) {
  if (!data.email) throw new Error('Email required'); // Business logic
  return await this.prisma.user.update(...);
}

// ✅ GOOD - Logic in domain
class User {
  updateEmail(email: string) {
    if (!email) throw new ValidationError('Email required');
    this.email = new Email(email);
  }
}
```

---

## ✅ Golden Rules

1. **Prisma stays in `adapters/out/persistence/prisma/`**
2. **The Core does NOT know Prisma** (only Repository interfaces)
3. **Mappers convert** Domain ↔ Prisma
4. **Repositories implement** Core interfaces
5. **Prisma configuration** is in `adapters/out/persistence/prisma/client.ts`
6. **Prisma schema** stays at API root (`prisma/schema.prisma`)

---

## 🔄 Data Flow

```
HTTP Request
    ↓
Controller (adapters/in/http)
    ↓
Service (core/services) ← Business logic
    ↓
Repository Interface (core/ports/out)
    ↓
PrismaRepository (adapters/out/persistence/prisma/repositories)
    → Mapper → Prisma types
    → PrismaClient → Database
    → Prisma types → Mapper → Domain Entity
    ↓
Service (core/services)
    ↓
Controller (adapters/in/http)
    ↓
HTTP Response
```

---

## 🎓 Why This Organization?

### Advantages

1. **Domain independence**: Core doesn't depend on any external library
2. **Easy testing**: We can easily mock repositories
3. **Easy DB change**: We can replace Prisma with TypeORM without touching the core
4. **Protected business logic**: Logic stays in domain, not in infrastructure

### Dependency Inversion Principle (SOLID)

```
Core (Domain) ← defines Repository interface
        ↑
        | implements
        |
Adapter (Prisma) ← depends on Core

The Core depends on NOTHING.
Adapters depend on the Core.
```

---

## 📚 Concrete Examples

### Example 1: Create a User

```typescript
// 1. Controller receives HTTP request
const user = await userService.createUser({ clerkId: '...', email: '...' });

// 2. Service creates domain entity
const user = User.create({ clerkId, email, role: UserRole.CLIENT });

// 3. Service calls repository
return await userRepository.create(user);

// 4. Repository converts with Mapper
const prismaData = UserMapper.toCreateData(user);

// 5. Repository uses Prisma
const created = await prisma.user.create({ data: prismaData });

// 6. Repository converts back to Domain
return UserMapper.toDomain(created);
```

### Example 2: Change Database

If tomorrow we want to switch from Prisma to TypeORM:

1. ✅ Core does NOT change (entities, services, use cases)
2. ✅ We create a new `TypeORMUserRepository` in `adapters/out/persistence/typeorm/`
3. ✅ We update the DI container
4. ✅ Done! The rest of the app works without modification

---

## 🔍 How to Know Where to Put a File?

Ask yourself this question:

> "Does this file contain **business logic** or **infrastructure**?"

- **Business logic** (validation, business rules) → `core/`
- **Infrastructure** (DB, HTTP, etc.) → `adapters/`
- **Prisma** is infrastructure → `adapters/out/persistence/prisma/`

---

**🚀 Summary: Everything Prisma-related goes in `adapters/out/persistence/prisma/`, never in `core/`!**
