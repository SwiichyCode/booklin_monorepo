# API Configuration

## 📋 Table of Contents

- [Environment Variables](#environment-variables)
- [CORS Configuration](#cors-configuration)
- [Middlewares](#middlewares)
- [Error Handling](#error-handling)

---

## 🔧 Environment Variables

### Location in Architecture

```
apps/api/src/
└── shared/
    └── config/
        └── env.ts  # Centralized configuration
```

### Configuration

Configuration is centralized in `shared/config/env.ts` and uses a **Singleton** to ensure a single instance.

```typescript
// shared/config/env.ts
export const env = new EnvironmentConfig().get();
export const envConfig = new EnvironmentConfig();
```

### Usage

```typescript
import { env, envConfig } from '../shared/config/env';

// Access variables
console.log(env.port); // 4000
console.log(env.databaseUrl); // postgresql://...

// Helpers
if (envConfig.isDevelopment()) {
  console.log('Development mode');
}

if (envConfig.isProduction()) {
  console.log('Production mode');
}
```

### Available Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NODE_ENV` | string | ❌ | Environment (development/production/test) |
| `PORT` | number | ❌ | Server port (default: 4000) |
| `API_URL` | string | ❌ | API URL |
| `DATABASE_URL` | string | ✅ | PostgreSQL URL |
| `JWT_SECRET` | string | ❌ | JWT secret |
| `CLERK_SECRET_KEY` | string | ❌ | Clerk key |
| `STRIPE_SECRET_KEY` | string | ❌ | Stripe key |
| `SENDGRID_API_KEY` | string | ❌ | SendGrid key |
| `CLOUDINARY_*` | string | ❌ | Cloudinary credentials |
| `GOOGLE_MAPS_API_KEY` | string | ❌ | Google Maps key |
| `ALLOWED_ORIGINS` | string[] | ❌ | CORS origins (comma-separated) |

### Validation

**Required** variables are validated at application startup:

```typescript
private validate(): void {
  const requiredVars: (keyof EnvConfig)[] = ['databaseUrl'];

  const missing = requiredVars.filter((key) => !this.config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
```

If a required variable is missing, the application **will not start**.

---

## 🌐 CORS Configuration

### Location in Architecture

```
apps/api/src/
└── adapters/
    └── in/
        └── http/
            └── config/
                └── cors.config.ts
```

### Why in `adapters/in/http/config`?

CORS is an **HTTP-specific configuration**, so it belongs to the **HTTP adapter** layer, not the business domain.

### Dynamic Configuration

CORS adapts automatically based on environment:

#### In **development**
```typescript
// All origins are allowed
if (envConfig.isDevelopment()) {
  return callback(null, true);
}
```

#### In **production**
```typescript
// Strict whitelist verification
if (env.allowedOrigins.includes(origin)) {
  callback(null, true);
} else {
  callback(new Error(`Origin ${origin} not allowed by CORS`));
}
```

### Usage

```typescript
// app.ts
import { corsMiddleware } from './adapters/in/http/config/cors.config';

app.use(corsMiddleware);
```

### Configure Allowed Origins

In your `.env` file:

```env
# Single origin
ALLOWED_ORIGINS=http://localhost:3000

# Multiple origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,https://app.booklin.fr,https://www.booklin.fr
```

---

## 🛡️ Middlewares

### Location in Architecture

```
apps/api/src/
└── adapters/
    └── in/
        └── http/
            └── middleware/
                ├── errorHandler.ts
                └── logger.ts
```

### 1. Logger (`requestLogger`)

Logs all HTTP requests.

#### In development
```
✅ POST /api/users - 201 (45ms)
❌ GET /api/users/123 - 404 (12ms)
⚠️ PATCH /api/users/456 - 400 (8ms)
```

#### In production
```json
{
  "method": "POST",
  "path": "/api/users",
  "statusCode": 201,
  "duration": "45ms",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1"
}
```

#### Usage

```typescript
// app.ts
import { requestLogger } from './adapters/in/http/middleware/logger';

app.use(requestLogger);
```

### 2. Error Handler (`errorHandler`)

Global error handling middleware.

#### Handles domain errors

```typescript
// ValidationError → 400
if (err instanceof ValidationError) {
  res.status(400).json({
    success: false,
    error: {
      message: err.message,
      code: 'VALIDATION_ERROR',
    },
  });
}

// NotFoundError → 404
if (err instanceof NotFoundError) {
  res.status(404).json({
    success: false,
    error: {
      message: err.message,
      code: 'NOT_FOUND',
    },
  });
}

// DomainError → 400
if (err instanceof DomainError) {
  res.status(400).json({
    success: false,
    error: {
      message: err.message,
      code: 'DOMAIN_ERROR',
    },
  });
}
```

#### Handles Prisma errors

```typescript
// Unique constraint violation (P2002) → 409
if (prismaError.code === 'P2002') {
  res.status(409).json({
    success: false,
    error: {
      message: 'A record with this value already exists',
      code: 'UNIQUE_CONSTRAINT_VIOLATION',
    },
  });
}

// Record not found (P2025) → 404
if (prismaError.code === 'P2025') {
  res.status(404).json({
    success: false,
    error: {
      message: 'Record not found',
      code: 'NOT_FOUND',
    },
  });
}
```

#### Generic error → 500

In **development**:
```json
{
  "success": false,
  "error": {
    "message": "Cannot read property 'id' of null",
    "code": "INTERNAL_SERVER_ERROR",
    "stack": "Error: Cannot read property...\n    at UserService..."
  }
}
```

In **production**:
```json
{
  "success": false,
  "error": {
    "message": "An unexpected error occurred",
    "code": "INTERNAL_SERVER_ERROR"
  }
}
```

#### Usage

```typescript
// app.ts
import { errorHandler, notFoundHandler } from './adapters/in/http/middleware/errorHandler';

// Routes...
app.use('/api', routes);

// Error middlewares (AFTER routes)
app.use(notFoundHandler); // 404
app.use(errorHandler);    // Global errors
```

⚠️ **Important**: Error middlewares must be declared **AFTER** routes.

---

## ❌ Error Handling

### Error Hierarchy

```
Error (JavaScript)
  └── DomainError (apps/api/src/core/domain/errors/DomainError.ts)
      ├── ValidationError
      └── NotFoundError
```

### Create a Domain Error

```typescript
// core/domain/errors/DomainError.ts
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}
```

### Use Errors in the Domain

```typescript
// core/domain/entities/User.ts
import { ValidationError } from '../errors/DomainError';

export class User {
  updateEmail(newEmail: string): void {
    if (!newEmail) {
      throw new ValidationError('Email is required');
    }
    this.props.email = new Email(newEmail);
  }
}
```

```typescript
// core/services/UserService.ts
import { NotFoundError } from '../domain/errors/DomainError';

async updateUser(command: UpdateUserCommand): Promise<User> {
  const user = await this.userRepository.findByClerkId(command.clerkId);

  if (!user) {
    throw new NotFoundError('User', command.clerkId);
  }

  // ...
}
```

### Automatic Propagation

Domain errors are **automatically caught** by the `errorHandler` middleware and converted to appropriate HTTP responses.

```typescript
// Controller - NO NEED for manual try/catch
async updateUser(req: Request, res: Response): Promise<void> {
  const user = await this.updateUserUseCase.execute({
    clerkId: req.params.clerkId,
    ...req.body,
  });
  res.json({ success: true, data: user });
}
```

The `errorHandler` middleware will:
1. Catch the error
2. Determine the type (ValidationError, NotFoundError, etc.)
3. Return the correct HTTP response (400, 404, 500, etc.)

---

## 🚀 Health Check

A `/health` endpoint is available to verify the API is running:

```bash
GET /health
```

Response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-10-09T14:30:00.000Z"
}
```

Used for:
- Monitoring (uptime checks)
- Load balancers
- CI/CD pipelines

---

## 📝 Complete Example (app.ts)

```typescript
import 'reflect-metadata';
import express from 'express';
import { setupContainer } from './shared/di/container';
import { corsMiddleware } from './adapters/in/http/config/cors.config';
import { requestLogger } from './adapters/in/http/middleware/logger';
import { errorHandler, notFoundHandler } from './adapters/in/http/middleware/errorHandler';
import routes from './routes';

// Setup DI
setupContainer();

export const createApp = () => {
  const app = express();

  // Global middlewares
  app.use(corsMiddleware);
  app.use(express.json());
  app.use(requestLogger);

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // Routes
  app.use('/api', routes);

  // Error handlers (AFTER routes)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
```

---

## 🔐 Security

### Sensitive Variables

⚠️ **NEVER** commit `.env` files containing secrets:

```bash
# .gitignore
.env
.env.local
.env.production
```

✅ **Always** provide a `.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-here
STRIPE_SECRET_KEY=sk_test_...
```

### In Production

1. Use a secrets manager (AWS Secrets Manager, Vault, etc.)
2. Never log secrets
3. Validate required variables at startup
4. Restrict CORS to allowed domains

---

## 🧪 Tests

### Mock Configuration

```typescript
// tests/setup.ts
jest.mock('../shared/config/env', () => ({
  env: {
    nodeEnv: 'test',
    port: 4001,
    databaseUrl: 'postgresql://test@localhost:5432/test_db',
    allowedOrigins: ['http://localhost:3000'],
  },
  envConfig: {
    isDevelopment: () => false,
    isProduction: () => false,
    isTest: () => true,
  },
}));
```

### Test Error Middleware

```typescript
describe('errorHandler', () => {
  it('should handle ValidationError', () => {
    const error = new ValidationError('Invalid email');
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Invalid email',
        code: 'VALIDATION_ERROR',
      },
    });
  });
});
```
