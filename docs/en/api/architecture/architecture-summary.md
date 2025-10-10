# Architecture Summary

## 📐 Hexagonal Architecture Layers

```
┌───────────────────────────────────────────────┐
│              HTTP CLIENT                      │
└─────────────────┬─────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  ADAPTERS IN (HTTP)                                 │
│  - Controllers                                      │
│  - Routes                                           │
│  - Middlewares (CORS, Logger, ErrorHandler)         │
│  - Config (cors.config.ts)                         │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  CORE - PORTS IN (Use Cases Interfaces)            │
│  - CreateUserUseCase                                │
│  - UpdateUserUseCase                                │
│  - GetUserUseCase                                   │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  CORE - SERVICES (Business Logic)                  │
│  - UserService (implements all Use Cases)          │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  CORE - DOMAIN (Business Entities)                 │
│  - User (rich entity)                              │
│  - Email (Value Object)                            │
│  - DomainError, ValidationError, NotFoundError     │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  CORE - PORTS OUT (Repository Interfaces)          │
│  - UserRepository                                   │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  ADAPTERS OUT (Persistence)                         │
│  - PrismaUserRepository (implements UserRepository) │
│  - UserMapper (Domain ↔ Prisma)                    │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL)                  │
└─────────────────────────────────────────────────────┘
```

## 🔄 Data Flow: Create a User

```
1. HTTP POST /api/users
   ↓
2. Middlewares (CORS, Logger)
   ↓
3. UserController.createUser()
   ↓
4. CreateUserUseCase.execute()
   ↓
5. UserService.createUser()
   ↓
6. User.create() (business validation)
   ↓
7. UserRepository.create()
   ↓
8. PrismaUserRepository.create()
   ↓
9. UserMapper.toCreateData()
   ↓
10. Prisma.user.create()
    ↓
11. PostgreSQL INSERT
    ↓
12. UserMapper.toDomain()
    ↓
13. Return User (Domain)
    ↓
14. HTTP Response JSON
```

## 📁 File Structure

```
apps/api/src/
├── core/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── User.ts
│   │   ├── value-objects/
│   │   │   └── Email.ts
│   │   └── errors/
│   │       └── DomainError.ts
│   ├── ports/
│   │   ├── in/
│   │   │   ├── CreateUserUseCase.ts
│   │   │   ├── UpdateUserUseCase.ts
│   │   │   └── GetUserUseCase.ts
│   │   └── out/
│   │       └── UserRepository.ts
│   └── services/
│       └── UserService.ts
│
├── adapters/
│   ├── in/
│   │   └── http/
│   │       ├── config/
│   │       │   └── cors.config.ts
│   │       ├── middleware/
│   │       │   ├── errorHandler.ts
│   │       │   └── logger.ts
│   │       ├── controllers/
│   │       │   └── UserController.ts
│   │       └── routes/
│   │           └── user.routes.ts
│   └── out/
│       └── persistence/
│           └── prisma/
│               ├── repositories/
│               │   └── PrismaUserRepository.ts
│               └── mappers/
│                   └── UserMapper.ts
│
└── shared/
    ├── config/
    │   └── env.ts
    └── di/
        └── container.ts
```

## 🎯 Key Points

### ✅ What We've Implemented

1. **Complete hexagonal architecture**
   - Core / Adapters separation
   - Ports IN (Use Cases)
   - Ports OUT (Repositories)

2. **Dependency injection (TSyringe)**
   - Centralized configuration
   - Easy testability

3. **Configuration in adapters**
   - `shared/config/env.ts` - Environment variables
   - `adapters/in/http/config/cors.config.ts` - CORS
   - `adapters/in/http/middleware/` - Middlewares

4. **Error handling**
   - Domain errors (DomainError, ValidationError, NotFoundError)
   - Global errorHandler middleware
   - Automatic conversion to HTTP responses

5. **Documentation**
   - hexagonal-architecture.md - Detailed architecture
   - configuration.md - Configuration and middlewares
   - README.md - Quick start

## 📊 Dependency Rules

```
CORE (Domain)
  ↑
  │ Depends on
  │
ADAPTERS
```

- The **Core** depends on NOTHING (not Prisma, Express, or HTTP)
- The **Adapters** depend on the Core
- **Dependency Inversion**: The Core defines interfaces, Adapters implement them

## 🚀 Next Steps

To migrate other modules (ProProfile, Booking, etc.):

1. Create Domain entities
2. Create IN ports (Use Cases)
3. Create OUT ports (Repositories)
4. Implement services
5. Create Prisma adapters + Mappers
6. Create controllers
7. Register in DI container

## 📚 Documentation

- [hexagonal-architecture.md](./hexagonal-architecture.md) - Complete architecture
- [configuration.md](../guides/configuration.md) - Config, CORS, middlewares
- [README.md](../README.md) - Quick start and usage
