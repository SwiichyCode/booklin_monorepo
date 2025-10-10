# 📦 Guide des Path Aliases - Import avec `@/`

## 🎯 Problème résolu

**Avant (imports relatifs) :**
```typescript
import { UserService } from '../../../../core/services/UserService';
import { DomainError } from '../../../../core/domain/errors/DomainError';
import { createUserSchema } from '../validation/user.validation';
```

**Après (path aliases) :**
```typescript
import { UserService } from '@/core/services/UserService';
import { DomainError } from '@/core/domain/errors/DomainError';
import { createUserSchema } from '@/adapters/in/http/validation/user.validation';
```

## ✅ Avantages

1. **Lisibilité** : Plus facile de comprendre d'où vient l'import
2. **Maintenabilité** : Déplacer des fichiers ne casse pas les imports
3. **Productivité** : Autocomplétion plus efficace dans l'IDE
4. **Clarté** : On voit immédiatement la couche architecturale

---

## 🔧 Configuration

### 1. TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 2. Runtime (`package.json`)

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only -r tsconfig-paths/register src/server.ts"
  },
  "devDependencies": {
    "tsconfig-paths": "^4.2.0"
  }
}
```

---

## 📖 Utilisation

### Structure de base

```
src/
├── core/                    → @/core/*
│   ├── domain/             → @/core/domain/*
│   ├── ports/              → @/core/ports/*
│   └── services/           → @/core/services/*
│
├── adapters/               → @/adapters/*
│   ├── in/                 → @/adapters/in/*
│   └── out/                → @/adapters/out/*
│
└── shared/                 → @/shared/*
```

### Exemples d'imports

#### Controllers
```typescript
// adapters/in/http/controllers/UserController.ts
import type { CreateUserUseCase } from '@/core/ports/in/CreateUserUseCase';
import { DomainError } from '@/core/domain/errors/DomainError';
import { createUserSchema } from '@/adapters/in/http/validation/user.validation';
```

#### Services (Core)
```typescript
// core/services/UserService.ts
import type { UserRepository } from '@/core/ports/out/UserRepository';
import { User, UserRole } from '@/core/domain/entities/User';
import { Email } from '@/core/domain/value-objects/Email';
import { NotFoundError } from '@/core/domain/errors/DomainError';
```

#### DI Container
```typescript
// shared/di/container.ts
import { UserService } from '@/core/services/UserService';
import { UserController } from '@/adapters/in/http/controllers/UserController';
import { PrismaUserRepository } from '@/adapters/out/persistence/prisma/repositories/PrismaUserRepository';
import { prismaClient } from '@/adapters/out/persistence/prisma/client';
```

#### Routes
```typescript
// adapters/in/http/routes/user.routes.ts
import { UserController } from '@/adapters/in/http/controllers/UserController';
import { authenticateUser } from '@/adapters/in/http/middleware/auth';
```

#### Middleware
```typescript
// adapters/in/http/middleware/verifyWebhook.ts
import type { VerifyWebhookUseCase } from '@/core/ports/in/VerifyWebhookUseCase';
import { envConfig } from '@/shared/config/env';
```

#### Repositories
```typescript
// adapters/out/persistence/prisma/repositories/PrismaUserRepository.ts
import type { UserRepository } from '@/core/ports/out/UserRepository';
import type { User } from '@/core/domain/entities/User';
import { UserMapper } from '@/adapters/out/persistence/prisma/mappers/UserMapper';
```

#### Mappers
```typescript
// adapters/out/persistence/prisma/mappers/UserMapper.ts
import { User } from '@/core/domain/entities/User';
import { Email } from '@/core/domain/value-objects/Email';
```

---

## 🎨 Règles d'usage

### ✅ À FAIRE

**1. Toujours utiliser `@/` pour les imports internes**
```typescript
import { UserService } from '@/core/services/UserService';
```

**2. Conserver les imports relatifs pour les fichiers très proches**
```typescript
// Dans user.routes.ts, ces deux sont acceptables :
import { UserController } from '@/adapters/in/http/controllers/UserController';
// OU
import { UserController } from '../controllers/UserController';
```

**3. Privilégier `@/` pour plus de clarté**
```typescript
// ✅ MEILLEUR - On voit la couche architecturale
import { UserService } from '@/core/services/UserService';

// ❌ MOINS CLAIR - Combien de niveaux en arrière ?
import { UserService } from '../../../../core/services/UserService';
```

### ❌ À ÉVITER

**1. Ne pas mélanger les styles**
```typescript
// ❌ MAUVAIS - Incohérent
import { UserService } from '@/core/services/UserService';
import { DomainError } from '../../../../core/domain/errors/DomainError';
```

**2. Ne pas utiliser `@/` pour les node_modules**
```typescript
// ❌ MAUVAIS
import { Request } from '@/express';

// ✅ BON
import { Request } from 'express';
```

---

## 🔍 Autocomplete dans VS Code

Pour que l'autocomplétion fonctionne bien, assurez-vous que VS Code utilise le bon TypeScript :

1. Ouvrir un fichier `.ts`
2. Cmd/Ctrl + Shift + P
3. Taper "TypeScript: Select TypeScript Version"
4. Choisir "Use Workspace Version"

---

## 🚀 Migration des anciens imports

### Script de recherche/remplacement (regex)

Chercher :
```regex
from ['"](\.\.\/)+(.*)['"]
```

Remplacer par :
```
from '@/$2'
```

### Ou manuellement :

```typescript
// Avant
import { UserService } from '../../core/services/UserService';

// Après
import { UserService } from '@/core/services/UserService';
```

---

## 📊 Mapping des imports courants

| Ancien | Nouveau |
|--------|---------|
| `../../../../core/domain/entities/User` | `@/core/domain/entities/User` |
| `../../../core/services/UserService` | `@/core/services/UserService` |
| `../../shared/config/env` | `@/shared/config/env` |
| `../validation/user.validation` | `@/adapters/in/http/validation/user.validation` |
| `../../out/persistence/prisma/client` | `@/adapters/out/persistence/prisma/client` |

---

## 🐛 Troubleshooting

### Erreur : "Cannot find module '@/...'"

**Solution 1 : Vérifier tsconfig.json**
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Solution 2 : Vérifier package.json**
```json
{
  "scripts": {
    "dev": "ts-node-dev ... -r tsconfig-paths/register src/server.ts"
  }
}
```

**Solution 3 : Installer tsconfig-paths**
```bash
pnpm add -D tsconfig-paths
```

### VS Code ne suggère pas les imports

**Solution :** Redémarrer le serveur TypeScript
1. Cmd/Ctrl + Shift + P
2. "TypeScript: Restart TS Server"

### Build production

Pour la production, si tu utilises `tsc` pour compiler, les path aliases sont automatiquement résolus. Mais si tu utilises un bundler (webpack, esbuild), tu devras peut-être configurer les aliases aussi :

**Webpack :**
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src')
  }
}
```

**esbuild :**
```javascript
plugins: [
  require('esbuild-plugin-path-alias')({
    '@': './src'
  })
]
```

---

## 🎯 Avantages architecturaux

### Clarté des couches

```typescript
// On voit immédiatement qu'on importe depuis le Core
import { User } from '@/core/domain/entities/User';

// On voit qu'on importe depuis les Adapters IN
import { UserController } from '@/adapters/in/http/controllers/UserController';

// On voit qu'on importe depuis les Adapters OUT
import { PrismaUserRepository } from '@/adapters/out/persistence/prisma/repositories/PrismaUserRepository';
```

### Respect de la Dependency Inversion

```typescript
// ❌ VISIBLE : Import depuis adapters dans core (violation !)
import { PrismaClient } from '@/adapters/out/persistence/prisma/client';

// ✅ CORRECT : Import d'interface dans core
import type { UserRepository } from '@/core/ports/out/UserRepository';
```

Les path aliases rendent les violations architecturales plus évidentes !

---

## 📚 Exemples complets

### Exemple 1 : Controller complet

```typescript
// adapters/in/http/controllers/UserController.ts
import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { ZodError } from 'zod';

// Core (Use Cases & Errors)
import type { CreateUserUseCase } from '@/core/ports/in/CreateUserUseCase';
import type { GetUserUseCase } from '@/core/ports/in/GetUserUseCase';
import { DomainError } from '@/core/domain/errors/DomainError';

// Adapters (Validation)
import { createUserSchema } from '@/adapters/in/http/validation/user.validation';

@injectable()
export class UserController {
  constructor(
    @inject('CreateUserUseCase') private createUserUseCase: CreateUserUseCase,
    @inject('GetUserUseCase') private getUserUseCase: GetUserUseCase
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    const validatedData = createUserSchema.parse(req.body);
    const user = await this.createUserUseCase.execute(validatedData);
    res.status(201).json({ success: true, data: user });
  }
}
```

### Exemple 2 : Service complet

```typescript
// core/services/UserService.ts
import { injectable, inject } from 'tsyringe';

// Ports
import type { UserRepository } from '@/core/ports/out/UserRepository';
import type { CreateUserCommand } from '@/core/ports/in/CreateUserUseCase';

// Domain
import { User, UserRole } from '@/core/domain/entities/User';
import { Email } from '@/core/domain/value-objects/Email';
import { NotFoundError } from '@/core/domain/errors/DomainError';

@injectable()
export class UserService {
  constructor(@inject('UserRepository') private userRepository: UserRepository) {}

  async createUser(command: CreateUserCommand): Promise<User> {
    const user = User.create({
      clerkId: command.clerkId,
      email: command.email,
      role: command.role,
      firstName: command.firstName,
      lastName: command.lastName,
    });

    return await this.userRepository.create(user);
  }
}
```

---

## 🎉 Résumé

✅ **Configuration complète** : `tsconfig.json` + `tsconfig-paths`
✅ **Import uniforme** : `@/` pour tous les fichiers internes
✅ **Lisibilité améliorée** : On voit les couches architecturales
✅ **Maintenabilité** : Refactoring plus facile
✅ **Autocomplete** : Meilleure expérience de développement

**Pattern recommandé :**
```typescript
import { ExternalLib } from 'package';        // Node modules
import { CoreDomain } from '@/core/*';        // Core domain
import { Adapter } from '@/adapters/*';       // Adapters
import { Shared } from '@/shared/*';          // Shared utilities
```

🚀 **Tu peux maintenant utiliser `@/` partout dans ton code !**
