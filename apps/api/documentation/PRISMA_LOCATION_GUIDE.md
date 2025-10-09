# 📁 Guide de Placement - Prisma dans l'Architecture Hexagonale

## 🎯 Principe de base

Dans l'architecture hexagonale, **Prisma est une infrastructure de persistance** et appartient donc à la couche **Adapters OUT**.

---

## 📂 Structure complète

```
apps/api/
├── prisma/                              ← Schéma & Migrations (racine du projet API)
│   ├── schema.prisma                   ← Définition du schéma de données
│   ├── migrations/                     ← Migrations de base de données
│   └── seed.ts                         ← Script de seed (optionnel)
│
├── src/
│   ├── core/                           ← DOMAINE (pas de Prisma ici !)
│   │   ├── domain/
│   │   │   └── entities/
│   │   │       └── User.ts             ← Entité du domaine (pas de Prisma)
│   │   ├── ports/
│   │   │   └── out/
│   │   │       └── UserRepository.ts   ← Interface (pas d'implémentation Prisma)
│   │   └── services/
│   │       └── UserService.ts          ← Logique métier (pas de Prisma)
│   │
│   ├── adapters/
│   │   └── out/
│   │       └── persistence/
│   │           └── prisma/             ← 🎯 TOUT PRISMA VA ICI
│   │               ├── client.ts       ← Configuration PrismaClient
│   │               ├── index.ts        ← Exports publics
│   │               ├── repositories/   ← Implémentations des repositories
│   │               │   ├── PrismaUserRepository.ts
│   │               │   ├── PrismaBookingRepository.ts
│   │               │   └── ...
│   │               └── mappers/        ← Conversion Domain ↔ Prisma
│   │                   ├── UserMapper.ts
│   │                   ├── BookingMapper.ts
│   │                   └── ...
│   │
│   └── shared/
│       ├── config/
│       │   └── env.ts                  ← Variables d'environnement (DATABASE_URL)
│       └── di/
│           └── container.ts            ← Enregistrement de PrismaClient
```

---

## 📝 Détail des fichiers

### 1. **prisma/schema.prisma** (racine API)
```prisma
// Définition du schéma de données
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
// Configuration centralisée du client Prisma
import { PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient({
  log: ['query', 'error', 'warn'],
});
```

### 3. **adapters/out/persistence/prisma/repositories/PrismaUserRepository.ts**
```typescript
// Implémentation du repository pour Prisma
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
// Conversion entre Domain Entity et Prisma types
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
// Enregistrement de PrismaClient dans le container DI
import { prismaClient } from '../../adapters/out/persistence/prisma/client';

export function setupContainer(): void {
  container.register('PrismaClient', {
    useValue: prismaClient,
  });
}
```

---

## 🚫 Ce qu'il NE FAUT PAS faire

### ❌ Ne jamais importer Prisma dans le Core
```typescript
// ❌ MAUVAIS - core/services/UserService.ts
import { PrismaClient } from '@prisma/client'; // NON !

// ❌ MAUVAIS - core/domain/entities/User.ts
import { User as PrismaUser } from '@prisma/client'; // NON !
```

### ❌ Ne jamais utiliser les types Prisma dans le Core
```typescript
// ❌ MAUVAIS
interface UserRepository {
  findById(id: string): Promise<PrismaUser>; // Type Prisma exposé
}

// ✅ BON
interface UserRepository {
  findById(id: string): Promise<User>; // Type du domaine
}
```

### ❌ Ne jamais mettre la logique métier dans les repositories
```typescript
// ❌ MAUVAIS - Repository
async updateUser(id: string, data: any) {
  if (!data.email) throw new Error('Email required'); // Logique métier
  return await this.prisma.user.update(...);
}

// ✅ BON - Logique dans le domaine
class User {
  updateEmail(email: string) {
    if (!email) throw new ValidationError('Email required');
    this.email = new Email(email);
  }
}
```

---

## ✅ Règles d'or

1. **Prisma reste dans `adapters/out/persistence/prisma/`**
2. **Le Core ne connaît PAS Prisma** (seulement les interfaces Repository)
3. **Les Mappers convertissent** Domain ↔ Prisma
4. **Les Repositories implémentent** les interfaces du Core
5. **La configuration Prisma** est dans `adapters/out/persistence/prisma/client.ts`
6. **Le schéma Prisma** reste à la racine API (`prisma/schema.prisma`)

---

## 🔄 Flux de données

```
HTTP Request
    ↓
Controller (adapters/in/http)
    ↓
Service (core/services) ← Logique métier
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

## 🎓 Pourquoi cette organisation ?

### Avantages

1. **Indépendance du domaine** : Le core ne dépend d'aucune bibliothèque externe
2. **Facilité de test** : On peut mocker les repositories facilement
3. **Changement de DB facile** : On peut remplacer Prisma par TypeORM sans toucher au core
4. **Logique métier protégée** : La logique reste dans le domaine, pas dans l'infrastructure

### Principe de Dépendance Inversée (SOLID)

```
Core (Domain) ← définit l'interface Repository
        ↑
        | implémente
        |
Adapter (Prisma) ← dépend du Core

Le Core ne dépend de RIEN.
Les Adapters dépendent du Core.
```

---

## 📚 Exemples concrets

### Exemple 1 : Créer un utilisateur

```typescript
// 1. Controller reçoit la requête HTTP
const user = await userService.createUser({ clerkId: '...', email: '...' });

// 2. Service crée l'entité du domaine
const user = User.create({ clerkId, email, role: UserRole.CLIENT });

// 3. Service appelle le repository
return await userRepository.create(user);

// 4. Repository convertit avec le Mapper
const prismaData = UserMapper.toCreateData(user);

// 5. Repository utilise Prisma
const created = await prisma.user.create({ data: prismaData });

// 6. Repository reconvertit en Domain
return UserMapper.toDomain(created);
```

### Exemple 2 : Changer de base de données

Si demain on veut passer de Prisma à TypeORM :

1. ✅ Le Core ne change PAS (entités, services, use cases)
2. ✅ On crée un nouveau `TypeORMUserRepository` dans `adapters/out/persistence/typeorm/`
3. ✅ On met à jour le container DI
4. ✅ Fini ! Le reste de l'app fonctionne sans modification

---

## 🔍 Comment savoir où mettre un fichier ?

Pose-toi cette question :

> "Est-ce que ce fichier contient de la **logique métier** ou de l'**infrastructure** ?"

- **Logique métier** (validation, règles business) → `core/`
- **Infrastructure** (BDD, HTTP, etc.) → `adapters/`
- **Prisma** c'est de l'infrastructure → `adapters/out/persistence/prisma/`

---

**🚀 En résumé : Tout ce qui est Prisma va dans `adapters/out/persistence/prisma/`, jamais dans `core/` !**
