# Architecture Hexagonale - Module User

## 📁 Structure des dossiers

```
apps/api/src/
├── core/                          # Cœur métier (Domain)
│   ├── domain/
│   │   ├── entities/
│   │   │   └── User.ts           # Entité riche avec logique métier
│   │   ├── value-objects/
│   │   │   └── Email.ts          # Value Object pour email
│   │   └── errors/
│   │       └── DomainError.ts    # Erreurs métier
│   │
│   ├── ports/                     # Interfaces (contrats)
│   │   ├── in/                   # Use Cases (ports d'entrée)
│   │   │   ├── CreateUserUseCase.ts
│   │   │   ├── UpdateUserUseCase.ts
│   │   │   ├── DeleteUserUseCase.ts
│   │   │   └── GetUserUseCase.ts
│   │   │
│   │   └── out/                  # Repositories, services externes
│   │       └── UserRepository.ts
│   │
│   └── services/                 # Implémentation use cases
│       └── UserService.ts
│
├── adapters/                     # Adaptateurs
│   ├── in/                       # Adaptateurs entrants (HTTP, WebSocket...)
│   │   └── http/
│   │       ├── config/          # Configuration HTTP
│   │       │   └── cors.config.ts
│   │       ├── middleware/      # Middlewares Express
│   │       │   ├── errorHandler.ts
│   │       │   └── logger.ts
│   │       ├── controllers/
│   │       │   └── UserController.ts
│   │       └── routes/
│   │           └── user.routes.ts
│   │
│   └── out/                      # Adaptateurs sortants (DB, APIs...)
│       └── persistence/
│           └── prisma/
│               ├── repositories/
│               │   └── PrismaUserRepository.ts
│               └── mappers/
│                   └── UserMapper.ts
│
└── shared/
    ├── di/
    │   └── container.ts          # Configuration DI
    └── config/
        └── env.ts                # Variables d'environnement
```

## 🎯 Flux de données

```
HTTP Request
    ↓
user.routes.ts (Router)
    ↓
UserController (Adaptateur IN)
    ↓
CreateUserUseCase (Port IN - Interface)
    ↓
UserService (Implémentation)
    ↓
UserRepository (Port OUT - Interface)
    ↓
PrismaUserRepository (Adaptateur OUT)
    ↓
Prisma → PostgreSQL
```

## 🔑 Concepts clés

### 1. **Entité Domain (User)**

L'entité `User` contient la logique métier :

```typescript
// core/domain/entities/User.ts
export class User {
  // Factory method pour créer un nouvel utilisateur
  static create(data: CreateUserProps): User { ... }

  // Méthodes métier
  updateEmail(newEmail: string): void { ... }
  updateProfile(data: {...}): void { ... }
  changeRole(newRole: UserRole): void { ... }
  isPro(): boolean { ... }
}
```

**Avantages** :
- Logique métier centralisée
- Validation dans l'entité
- Testable facilement sans dépendances externes

### 2. **Ports (Interfaces)**

Les ports définissent les contrats sans implémentation.

**Ports IN** (Use Cases) - Ce que l'application PEUT FAIRE :
```typescript
// core/ports/in/CreateUserUseCase.ts
export interface CreateUserUseCase {
  execute(command: CreateUserCommand): Promise<User>;
}
```

**Ports OUT** (Repositories) - Ce que l'application A BESOIN :
```typescript
// core/ports/out/UserRepository.ts
export interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  // ...
}
```

**Avantages** :
- Découplage total entre domaine et infrastructure
- Facilite les tests (mocks simples)
- Permet de changer d'implémentation facilement

### 3. **Services (Use Cases)**

Le service implémente la logique applicative :

```typescript
// core/services/UserService.ts
@injectable()
export class UserService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository
  ) {}

  async createUser(command: CreateUserCommand): Promise<User> {
    // 1. Créer l'entité domain
    const user = User.create(command);

    // 2. Persister via le repository
    return await this.userRepository.create(user);
  }
}
```

**Avantages** :
- Logique applicative claire
- Orchestration des entités et repositories
- Injection de dépendances

### 4. **Adaptateurs**

#### Adaptateur IN (Controller)
```typescript
// adapters/in/http/controllers/UserController.ts
@injectable()
export class UserController {
  constructor(
    @inject('CreateUserUseCase')
    private createUserUseCase: CreateUserUseCase
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    const user = await this.createUserUseCase.execute(req.body);
    res.json({ success: true, data: this.toDTO(user) });
  }
}
```

#### Adaptateur OUT (Repository)
```typescript
// adapters/out/persistence/prisma/repositories/PrismaUserRepository.ts
@injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    @inject('PrismaClient')
    private prisma: PrismaClient
  ) {}

  async create(user: User): Promise<User> {
    const data = UserMapper.toCreateData(user);
    const created = await this.prisma.user.create({ data });
    return UserMapper.toDomain(created);
  }
}
```

### 5. **Mappers**

Convertissent entre Domain et Persistence :

```typescript
// adapters/out/persistence/prisma/mappers/UserMapper.ts
export class UserMapper {
  // Prisma → Domain
  static toDomain(prismaUser: PrismaUser): User {
    return User.fromPersistence({
      id: prismaUser.id,
      email: prismaUser.email ? new Email(prismaUser.email) : null,
      // ...
    });
  }

  // Domain → Prisma
  static toCreateData(user: User) {
    return {
      clerkId: user.clerkId,
      email: user.email?.toString() ?? null,
      // ...
    };
  }
}
```

**Avantages** :
- Séparation totale entre modèle Domain et modèle DB
- Permet de changer le schéma DB sans toucher au domaine
- Conversions explicites et testables

### 6. **Injection de dépendances (TSyringe)**

```typescript
// shared/di/container.ts
export function setupContainer(): void {
  // Infrastructure
  container.register('PrismaClient', {
    useValue: new PrismaClient(),
  });

  // Repositories
  container.register<UserRepository>('UserRepository', {
    useClass: PrismaUserRepository,
  });

  // Use Cases
  container.registerSingleton('UserServiceInstance', UserService);

  container.register('CreateUserUseCase', {
    useFactory: (c) => {
      const service = c.resolve<UserService>('UserServiceInstance');
      return {
        execute: (command) => service.createUser(command),
      };
    },
  });
}
```

**Avantages** :
- Pas de `new` dans le code
- Facile de mocker pour les tests
- Configuration centralisée

## 🧪 Comment tester

### Test unitaire (Service)
```typescript
describe('UserService', () => {
  it('should create user', async () => {
    // Mock repository
    const mockRepo = {
      create: jest.fn().mockResolvedValue(mockUser),
    };

    // Injection manuelle
    const service = new UserService(mockRepo);

    const result = await service.createUser({
      clerkId: 'clerk_123',
      email: 'test@example.com',
      role: UserRole.CLIENT,
    });

    expect(mockRepo.create).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
```

### Test d'intégration (Controller)
```typescript
describe('UserController', () => {
  it('should create user via HTTP', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        clerkId: 'clerk_123',
        email: 'test@example.com',
        role: 'CLIENT',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

## 🚀 Routes disponibles

```
POST   /api/users                    # Créer un utilisateur
PATCH  /api/users/:clerkId          # Mettre à jour
DELETE /api/users/:clerkId          # Supprimer
GET    /api/users/clerk/:clerkId    # Par ClerkId
GET    /api/users/id/:id            # Par ID
GET    /api/users/email/:email      # Par Email
GET    /api/users                   # Liste (avec filtres)
```

## 📝 Comment ajouter un nouveau Use Case

### Exemple : "BanUserUseCase"

1. **Créer le port IN**
```typescript
// core/ports/in/BanUserUseCase.ts
export interface BanUserCommand {
  userId: string;
  reason: string;
}

export interface BanUserUseCase {
  execute(command: BanUserCommand): Promise<User>;
}
```

2. **Ajouter la méthode dans l'entité**
```typescript
// core/domain/entities/User.ts
export class User {
  private isBanned: boolean = false;

  ban(reason: string): void {
    if (this.isBanned) {
      throw new DomainError('User already banned');
    }
    this.isBanned = true;
    // Logique métier...
  }
}
```

3. **Implémenter dans le service**
```typescript
// core/services/UserService.ts
async banUser(command: BanUserCommand): Promise<User> {
  const user = await this.userRepository.findById(command.userId);
  if (!user) throw new NotFoundError('User', command.userId);

  user.ban(command.reason);

  return await this.userRepository.update(user.id, user);
}
```

4. **Enregistrer dans le container**
```typescript
// shared/di/container.ts
container.register('BanUserUseCase', {
  useFactory: (c) => {
    const service = c.resolve<UserService>('UserServiceInstance');
    return {
      execute: (command) => service.banUser(command),
    };
  },
});
```

5. **Ajouter la route**
```typescript
// adapters/in/http/routes/user.routes.ts
router.post('/:userId/ban', (req, res) =>
  userController.banUser(req, res)
);
```

## 🎯 Principes à respecter

### ✅ À FAIRE

- **Logique métier dans les entités** : Validation, règles business
- **Services orchestrent** : Coordination entre entités et repositories
- **Interfaces partout** : Ports IN et OUT sont des contrats
- **Mappers explicites** : Conversions Domain ↔ Persistence
- **Tests unitaires du domaine** : Sans dépendances externes

### ❌ À NE PAS FAIRE

- **Pas de Prisma dans le domaine** : Jamais d'import `@prisma/client` dans `core/`
- **Pas de logique dans les controllers** : Juste validation + délégation
- **Pas de logique dans les repositories** : Juste CRUD + mapping
- **Pas de `new` dans le code métier** : Utiliser DI
- **Pas de types Prisma exposés** : Toujours mapper vers types Domain

## 📚 Pour aller plus loin

1. **Ajouter des Events** : Domain Events pour découpler les actions
2. **CQRS** : Séparer Commands (write) et Queries (read)
3. **Specifications** : Pattern pour filtres complexes
4. **Aggregates** : Grouper entités liées (User + ProProfile)

## 🔗 Ressources

- [Architecture Hexagonale (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)
- [DDD in TypeScript](https://khalilstemmler.com/articles/domain-driven-design-intro/)
- [TSyringe Docs](https://github.com/microsoft/tsyringe)
