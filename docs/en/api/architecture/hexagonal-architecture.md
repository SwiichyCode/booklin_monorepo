# Hexagonal Architecture - User Module

## 📁 Folder Structure

```
apps/api/src/
├── core/                          # Business Core (Domain)
│   ├── domain/
│   │   ├── entities/
│   │   │   └── User.ts           # Rich entity with business logic
│   │   ├── value-objects/
│   │   │   └── Email.ts          # Value Object for email
│   │   └── errors/
│   │       └── DomainError.ts    # Business errors
│   │
│   ├── ports/                     # Interfaces (contracts)
│   │   ├── in/                   # Use Cases (input ports)
│   │   │   ├── CreateUserUseCase.ts
│   │   │   ├── UpdateUserUseCase.ts
│   │   │   ├── DeleteUserUseCase.ts
│   │   │   └── GetUserUseCase.ts
│   │   │
│   │   └── out/                  # Repositories, external services
│   │       └── UserRepository.ts
│   │
│   └── services/                 # Use case implementations
│       └── UserService.ts
│
├── adapters/                     # Adapters
│   ├── in/                       # Inbound adapters (HTTP, WebSocket...)
│   │   └── http/
│   │       ├── config/          # HTTP configuration
│   │       │   └── cors.config.ts
│   │       ├── middleware/      # Express middlewares
│   │       │   ├── errorHandler.ts
│   │       │   └── logger.ts
│   │       ├── controllers/
│   │       │   └── UserController.ts
│   │       └── routes/
│   │           └── user.routes.ts
│   │
│   └── out/                      # Outbound adapters (DB, APIs...)
│       └── persistence/
│           └── prisma/
│               ├── repositories/
│               │   └── PrismaUserRepository.ts
│               └── mappers/
│                   └── UserMapper.ts
│
└── shared/
    ├── di/
    │   └── container.ts          # DI configuration
    └── config/
        └── env.ts                # Environment variables
```

## 🎯 Data Flow

```
HTTP Request
    ↓
user.routes.ts (Router)
    ↓
UserController (IN Adapter)
    ↓
CreateUserUseCase (IN Port - Interface)
    ↓
UserService (Implementation)
    ↓
UserRepository (OUT Port - Interface)
    ↓
PrismaUserRepository (OUT Adapter)
    ↓
Prisma → PostgreSQL
```

## 🔑 Key Concepts

### 1. **Domain Entity (User)**

The `User` entity contains business logic:

```typescript
// core/domain/entities/User.ts
export class User {
  // Factory method to create a new user
  static create(data: CreateUserProps): User { ... }

  // Business methods
  updateEmail(newEmail: string): void { ... }
  updateProfile(data: {...}): void { ... }
  changeRole(newRole: UserRole): void { ... }
  isPro(): boolean { ... }
}
```

**Advantages**:
- Centralized business logic
- Validation in the entity
- Easily testable without external dependencies

### 2. **Ports (Interfaces)**

Ports define contracts without implementation.

**IN Ports** (Use Cases) - What the application CAN DO:
```typescript
// core/ports/in/CreateUserUseCase.ts
export interface CreateUserUseCase {
  execute(command: CreateUserCommand): Promise<User>;
}
```

**OUT Ports** (Repositories) - What the application NEEDS:
```typescript
// core/ports/out/UserRepository.ts
export interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  // ...
}
```

**Advantages**:
- Total decoupling between domain and infrastructure
- Facilitates testing (simple mocks)
- Allows changing implementation easily

### 3. **Services (Use Cases)**

The service implements application logic:

```typescript
// core/services/UserService.ts
@injectable()
export class UserService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository
  ) {}

  async createUser(command: CreateUserCommand): Promise<User> {
    // 1. Create domain entity
    const user = User.create(command);

    // 2. Persist via repository
    return await this.userRepository.create(user);
  }
}
```

**Advantages**:
- Clear application logic
- Orchestration of entities and repositories
- Dependency injection

### 4. **Adapters**

#### IN Adapter (Controller)
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

#### OUT Adapter (Repository)
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

Convert between Domain and Persistence:

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

**Advantages**:
- Total separation between Domain and DB models
- Allows changing DB schema without touching domain
- Explicit and testable conversions

### 6. **Dependency Injection (TSyringe)**

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

**Advantages**:
- No `new` in the code
- Easy to mock for tests
- Centralized configuration

## 🧪 How to Test

### Unit Test (Service)
```typescript
describe('UserService', () => {
  it('should create user', async () => {
    // Mock repository
    const mockRepo = {
      create: jest.fn().mockResolvedValue(mockUser),
    };

    // Manual injection
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

### Integration Test (Controller)
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

## 🚀 Available Routes

```
POST   /api/users                    # Create a user
PATCH  /api/users/:clerkId          # Update
DELETE /api/users/:clerkId          # Delete
GET    /api/users/clerk/:clerkId    # By ClerkId
GET    /api/users/id/:id            # By ID
GET    /api/users/email/:email      # By Email
GET    /api/users                   # List (with filters)
```

## 📝 How to Add a New Use Case

### Example: "BanUserUseCase"

1. **Create the IN port**
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

2. **Add the method in the entity**
```typescript
// core/domain/entities/User.ts
export class User {
  private isBanned: boolean = false;

  ban(reason: string): void {
    if (this.isBanned) {
      throw new DomainError('User already banned');
    }
    this.isBanned = true;
    // Business logic...
  }
}
```

3. **Implement in the service**
```typescript
// core/services/UserService.ts
async banUser(command: BanUserCommand): Promise<User> {
  const user = await this.userRepository.findById(command.userId);
  if (!user) throw new NotFoundError('User', command.userId);

  user.ban(command.reason);

  return await this.userRepository.update(user.id, user);
}
```

4. **Register in the container**
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

5. **Add the route**
```typescript
// adapters/in/http/routes/user.routes.ts
router.post('/:userId/ban', (req, res) =>
  userController.banUser(req, res)
);
```

## 🎯 Principles to Follow

### ✅ DO

- **Business logic in entities**: Validation, business rules
- **Services orchestrate**: Coordination between entities and repositories
- **Interfaces everywhere**: IN and OUT ports are contracts
- **Explicit mappers**: Domain ↔ Persistence conversions
- **Unit test the domain**: Without external dependencies

### ❌ DON'T

- **No Prisma in the domain**: Never import `@prisma/client` in `core/`
- **No logic in controllers**: Just validation + delegation
- **No logic in repositories**: Just CRUD + mapping
- **No `new` in business code**: Use DI
- **No Prisma types exposed**: Always map to Domain types

## 📚 Going Further

1. **Add Events**: Domain Events to decouple actions
2. **CQRS**: Separate Commands (write) and Queries (read)
3. **Specifications**: Pattern for complex filters
4. **Aggregates**: Group related entities (User + ProProfile)

## 🔗 Resources

- [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)
- [DDD in TypeScript](https://khalilstemmler.com/articles/domain-driven-design-intro/)
- [TSyringe Docs](https://github.com/microsoft/tsyringe)
