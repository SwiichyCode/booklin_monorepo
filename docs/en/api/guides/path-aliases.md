# 📦 Path Aliases Guide - Importing with `@/`

## 🎯 Problem Solved

**Before (relative imports):**
```typescript
import { UserService } from '../../../../core/services/UserService';
import { DomainError } from '../../../../core/domain/errors/DomainError';
import { createUserSchema } from '../validation/user.validation';
```

**After (path aliases):**
```typescript
import { UserService } from '@/core/services/UserService';
import { DomainError } from '@/core/domain/errors/DomainError';
import { createUserSchema } from '@/adapters/in/http/validation/user.validation';
```

## ✅ Advantages

1. **Readability**: Easier to understand where the import comes from
2. **Maintainability**: Moving files doesn't break imports
3. **Productivity**: More efficient autocomplete in IDE
4. **Clarity**: Immediately see the architectural layer

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

## 📖 Usage

### Base Structure

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

### Import Examples

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

## 🎨 Usage Rules

### ✅ DO

**1. Always use `@/` for internal imports**
```typescript
import { UserService } from '@/core/services/UserService';
```

**2. Keep relative imports for very close files**
```typescript
// In user.routes.ts, both are acceptable:
import { UserController } from '@/adapters/in/http/controllers/UserController';
// OR
import { UserController } from '../controllers/UserController';
```

**3. Prefer `@/` for more clarity**
```typescript
// ✅ BETTER - You see the architectural layer
import { UserService } from '@/core/services/UserService';

// ❌ LESS CLEAR - How many levels back?
import { UserService } from '../../../../core/services/UserService';
```

### ❌ AVOID

**1. Don't mix styles**
```typescript
// ❌ BAD - Inconsistent
import { UserService } from '@/core/services/UserService';
import { DomainError } from '../../../../core/domain/errors/DomainError';
```

**2. Don't use `@/` for node_modules**
```typescript
// ❌ BAD
import { Request } from '@/express';

// ✅ GOOD
import { Request } from 'express';
```

---

## 🔍 Autocomplete in VS Code

For autocomplete to work well, make sure VS Code uses the correct TypeScript:

1. Open a `.ts` file
2. Cmd/Ctrl + Shift + P
3. Type "TypeScript: Select TypeScript Version"
4. Choose "Use Workspace Version"

---

## 🚀 Migrating Old Imports

### Search/Replace Script (regex)

Search:
```regex
from ['"](\.\.\/)+(.*)['"]
```

Replace with:
```
from '@/$2'
```

### Or manually:

```typescript
// Before
import { UserService } from '../../core/services/UserService';

// After
import { UserService } from '@/core/services/UserService';
```

---

## 📊 Common Import Mappings

| Old | New |
|-----|-----|
| `../../../../core/domain/entities/User` | `@/core/domain/entities/User` |
| `../../../core/services/UserService` | `@/core/services/UserService` |
| `../../shared/config/env` | `@/shared/config/env` |
| `../validation/user.validation` | `@/adapters/in/http/validation/user.validation` |
| `../../out/persistence/prisma/client` | `@/adapters/out/persistence/prisma/client` |

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@/...'"

**Solution 1: Check tsconfig.json**
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

**Solution 2: Check package.json**
```json
{
  "scripts": {
    "dev": "ts-node-dev ... -r tsconfig-paths/register src/server.ts"
  }
}
```

**Solution 3: Install tsconfig-paths**
```bash
pnpm add -D tsconfig-paths
```

### VS Code doesn't suggest imports

**Solution:** Restart the TypeScript server
1. Cmd/Ctrl + Shift + P
2. "TypeScript: Restart TS Server"

### Production Build

For production, if you use `tsc` to compile, path aliases are automatically resolved. But if you use a bundler (webpack, esbuild), you may need to configure aliases there too:

**Webpack:**
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src')
  }
}
```

**esbuild:**
```javascript
plugins: [
  require('esbuild-plugin-path-alias')({
    '@': './src'
  })
]
```

---

## 🎯 Architectural Advantages

### Layer Clarity

```typescript
// You immediately see we're importing from Core
import { User } from '@/core/domain/entities/User';

// You see we're importing from Adapters IN
import { UserController } from '@/adapters/in/http/controllers/UserController';

// You see we're importing from Adapters OUT
import { PrismaUserRepository } from '@/adapters/out/persistence/prisma/repositories/PrismaUserRepository';
```

### Dependency Inversion Respect

```typescript
// ❌ VISIBLE: Import from adapters in core (violation!)
import { PrismaClient } from '@/adapters/out/persistence/prisma/client';

// ✅ CORRECT: Import interface in core
import type { UserRepository } from '@/core/ports/out/UserRepository';
```

Path aliases make architectural violations more obvious!

---

## 📚 Complete Examples

### Example 1: Complete Controller

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

### Example 2: Complete Service

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

## 🎉 Summary

✅ **Complete configuration**: `tsconfig.json` + `tsconfig-paths`
✅ **Uniform imports**: `@/` for all internal files
✅ **Improved readability**: You see architectural layers
✅ **Maintainability**: Easier refactoring
✅ **Autocomplete**: Better development experience

**Recommended pattern:**
```typescript
import { ExternalLib } from 'package';        // Node modules
import { CoreDomain } from '@/core/*';        // Core domain
import { Adapter } from '@/adapters/*';       // Adapters
import { Shared } from '@/shared/*';          // Shared utilities
```

🚀 **You can now use `@/` everywhere in your code!**
