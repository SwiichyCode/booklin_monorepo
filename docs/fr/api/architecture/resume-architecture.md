# Résumé de l'architecture

## 📐 Couches de l'architecture hexagonale

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
│  - UserService (implémente tous les Use Cases)     │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  CORE - DOMAIN (Entités métier)                    │
│  - User (entité riche)                             │
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
│  - PrismaUserRepository (implémente UserRepository) │
│  - UserMapper (Domain ↔ Prisma)                    │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL)                  │
└─────────────────────────────────────────────────────┘
```

## 🔄 Flux de données : Créer un utilisateur

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
6. User.create() (validation métier)
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

## 📁 Structure des fichiers

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

## 🎯 Points clés

### ✅ Ce qu'on a mis en place

1. **Architecture hexagonale complète**
   - Séparation Core / Adapters
   - Ports IN (Use Cases)
   - Ports OUT (Repositories)

2. **Injection de dépendances (TSyringe)**
   - Configuration centralisée
   - Testabilité facilitée

3. **Configuration dans les adaptateurs**
   - `shared/config/env.ts` - Variables d'environnement
   - `adapters/in/http/config/cors.config.ts` - CORS
   - `adapters/in/http/middleware/` - Middlewares

4. **Gestion des erreurs**
   - Erreurs du domaine (DomainError, ValidationError, NotFoundError)
   - Middleware global errorHandler
   - Conversion automatique en réponses HTTP

5. **Documentation**
   - architecture-hexagonale.md - Architecture détaillée
   - configuration.md - Configuration et middlewares
   - README.md - Démarrage rapide

## 📊 Règles de dépendance

```
CORE (Domain)
  ↑
  │ Dépend de
  │
ADAPTERS
```

- Le **Core** ne dépend de RIEN (ni Prisma, ni Express, ni HTTP)
- Les **Adapters** dépendent du Core
- **Inversion de dépendance** : Le Core définit les interfaces, les Adapters les implémentent

## 🚀 Prochaines étapes

Pour migrer les autres modules (ProProfile, Booking, etc.) :

1. Créer les entités Domain
2. Créer les ports IN (Use Cases)
3. Créer les ports OUT (Repositories)
4. Implémenter les services
5. Créer les adaptateurs Prisma + Mappers
6. Créer les controllers
7. Enregistrer dans le container DI

## 📚 Documentation

- [architecture-hexagonale.md](./architecture-hexagonale.md) - Architecture complète
- [configuration.md](../guides/configuration.md) - Config, CORS, middlewares
- [README.md](../README.md) - Démarrage et utilisation
