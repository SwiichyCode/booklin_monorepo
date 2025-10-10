# Configuration de l'API

## 📋 Table des matières

- [Variables d'environnement](#variables-denvironnement)
- [Configuration CORS](#configuration-cors)
- [Middlewares](#middlewares)
- [Gestion des erreurs](#gestion-des-erreurs)

---

## 🔧 Variables d'environnement

### Emplacement dans l'architecture

```
apps/api/src/
└── shared/
    └── config/
        └── env.ts  # Configuration centralisée
```

### Configuration

La configuration est centralisée dans `shared/config/env.ts` et utilise un **Singleton** pour garantir une seule instance.

```typescript
// shared/config/env.ts
export const env = new EnvironmentConfig().get();
export const envConfig = new EnvironmentConfig();
```

### Utilisation

```typescript
import { env, envConfig } from '../shared/config/env';

// Accéder aux variables
console.log(env.port); // 4000
console.log(env.databaseUrl); // postgresql://...

// Helpers
if (envConfig.isDevelopment()) {
  console.log('Mode développement');
}

if (envConfig.isProduction()) {
  console.log('Mode production');
}
```

### Variables disponibles

| Variable | Type | Obligatoire | Description |
|----------|------|-------------|-------------|
| `NODE_ENV` | string | ❌ | Environnement (development/production/test) |
| `PORT` | number | ❌ | Port du serveur (défaut: 4000) |
| `API_URL` | string | ❌ | URL de l'API |
| `DATABASE_URL` | string | ✅ | URL PostgreSQL |
| `JWT_SECRET` | string | ❌ | Secret pour JWT |
| `CLERK_SECRET_KEY` | string | ❌ | Clé Clerk |
| `STRIPE_SECRET_KEY` | string | ❌ | Clé Stripe |
| `SENDGRID_API_KEY` | string | ❌ | Clé SendGrid |
| `CLOUDINARY_*` | string | ❌ | Credentials Cloudinary |
| `GOOGLE_MAPS_API_KEY` | string | ❌ | Clé Google Maps |
| `ALLOWED_ORIGINS` | string[] | ❌ | Origines CORS (séparées par virgules) |

### Validation

Les variables **obligatoires** sont validées au démarrage de l'application :

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

Si une variable obligatoire manque, l'application **ne démarre pas**.

---

## 🌐 Configuration CORS

### Emplacement dans l'architecture

```
apps/api/src/
└── adapters/
    └── in/
        └── http/
            └── config/
                └── cors.config.ts
```

### Pourquoi dans `adapters/in/http/config` ?

CORS est une **configuration spécifique à HTTP**, donc elle appartient à la couche **adaptateur HTTP**, pas au domaine métier.

### Configuration dynamique

Le CORS s'adapte automatiquement selon l'environnement :

#### En **développement**
```typescript
// Toutes les origines sont autorisées
if (envConfig.isDevelopment()) {
  return callback(null, true);
}
```

#### En **production**
```typescript
// Vérification stricte de la whitelist
if (env.allowedOrigins.includes(origin)) {
  callback(null, true);
} else {
  callback(new Error(`Origin ${origin} not allowed by CORS`));
}
```

### Utilisation

```typescript
// app.ts
import { corsMiddleware } from './adapters/in/http/config/cors.config';

app.use(corsMiddleware);
```

### Configurer les origines autorisées

Dans votre fichier `.env` :

```env
# Une seule origine
ALLOWED_ORIGINS=http://localhost:3000

# Multiples origines (séparées par virgules)
ALLOWED_ORIGINS=http://localhost:3000,https://app.booklin.fr,https://www.booklin.fr
```

---

## 🛡️ Middlewares

### Emplacement dans l'architecture

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

Logue toutes les requêtes HTTP.

#### En développement
```
✅ POST /api/users - 201 (45ms)
❌ GET /api/users/123 - 404 (12ms)
⚠️ PATCH /api/users/456 - 400 (8ms)
```

#### En production
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

#### Utilisation

```typescript
// app.ts
import { requestLogger } from './adapters/in/http/middleware/logger';

app.use(requestLogger);
```

### 2. Error Handler (`errorHandler`)

Middleware global de gestion des erreurs.

#### Gère les erreurs du domaine

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

#### Gère les erreurs Prisma

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

#### Erreur générique → 500

En **développement** :
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

En **production** :
```json
{
  "success": false,
  "error": {
    "message": "An unexpected error occurred",
    "code": "INTERNAL_SERVER_ERROR"
  }
}
```

#### Utilisation

```typescript
// app.ts
import { errorHandler, notFoundHandler } from './adapters/in/http/middleware/errorHandler';

// Routes...
app.use('/api', routes);

// Middlewares d'erreur (APRÈS les routes)
app.use(notFoundHandler); // 404
app.use(errorHandler);    // Erreurs globales
```

⚠️ **Important** : Les middlewares d'erreur doivent être déclarés **APRÈS** les routes.

---

## ❌ Gestion des erreurs

### Hiérarchie des erreurs

```
Error (JavaScript)
  └── DomainError (apps/api/src/core/domain/errors/DomainError.ts)
      ├── ValidationError
      └── NotFoundError
```

### Créer une erreur du domaine

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

### Utiliser les erreurs dans le domaine

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

### Propagation automatique

Les erreurs du domaine sont **automatiquement interceptées** par le middleware `errorHandler` et converties en réponses HTTP appropriées.

```typescript
// Controller - PAS BESOIN de try/catch manuel
async updateUser(req: Request, res: Response): Promise<void> {
  const user = await this.updateUserUseCase.execute({
    clerkId: req.params.clerkId,
    ...req.body,
  });
  res.json({ success: true, data: user });
}
```

Le middleware `errorHandler` va :
1. Capturer l'erreur
2. Déterminer le type (ValidationError, NotFoundError, etc.)
3. Retourner la bonne réponse HTTP (400, 404, 500, etc.)

---

## 🚀 Health Check

Un endpoint `/health` est disponible pour vérifier que l'API fonctionne :

```bash
GET /health
```

Réponse :
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-10-09T14:30:00.000Z"
}
```

Utilisé pour :
- Monitoring (uptime checks)
- Load balancers
- CI/CD pipelines

---

## 📝 Exemple complet (app.ts)

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

  // Middlewares globaux
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

  // Error handlers (APRÈS les routes)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
```

---

## 🔐 Sécurité

### Variables sensibles

⚠️ **NE JAMAIS** committer les fichiers `.env` contenant des secrets :

```bash
# .gitignore
.env
.env.local
.env.production
```

✅ **Toujours** fournir un `.env.example` :

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-here
STRIPE_SECRET_KEY=sk_test_...
```

### En production

1. Utiliser un gestionnaire de secrets (AWS Secrets Manager, Vault, etc.)
2. Ne jamais logger les secrets
3. Valider les variables obligatoires au démarrage
4. Restreindre les CORS aux domaines autorisés

---

## 🧪 Tests

### Mocker la configuration

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

### Tester le middleware d'erreur

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
