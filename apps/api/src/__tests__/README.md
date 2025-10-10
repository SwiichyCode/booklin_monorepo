# Tests API

## Structure

```
__tests__/
├── jest.setup.ts          # Configuration globale Jest
├── helpers/               # Utilitaires pour tests
│   └── test-server.ts    # Helpers pour tests d'API
├── integration/           # Tests d'intégration (routes complètes)
│   └── health.test.ts
└── unit/                  # Tests unitaires (à créer)
```

## Commandes

```bash
# Lancer tous les tests
pnpm test

# Lancer les tests en mode watch
pnpm test:watch

# Lancer les tests avec coverage
pnpm test:cov
```

## Écrire des tests

### Test unitaire simple

```typescript
describe('MyFunction', () => {
  it('should do something', () => {
    expect(myFunction(input)).toBe(expected);
  });
});
```

### Test d'intégration avec Express

```typescript
import { createTestApp, createTestRequest } from '../helpers/test-server';

describe('My Route', () => {
  const app = createTestApp();

  // Setup de la route
  app.get('/my-route', (req, res) => {
    res.json({ message: 'Hello' });
  });

  it('should return response', async () => {
    const response = await createTestRequest(app)
      .get('/my-route');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello');
  });
});
```

### Test avec authentification Clerk

```typescript
import { createTestApp, createTestRequest, mockClerkAuth } from '../helpers/test-server';

describe('Protected Route', () => {
  const app = createTestApp();

  app.get('/protected', mockClerkAuth(), (req, res) => {
    res.json({ userId: req.auth.userId });
  });

  it('should access protected route', async () => {
    const response = await createTestRequest(app)
      .get('/protected');

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe('user_test123');
  });
});
```

## Configuration

- **Transform**: Utilise `@swc/jest` pour compiler TypeScript (plus rapide que ts-jest)
- **Decorators**: Support des décorateurs pour `tsyringe` et `reflect-metadata`
- **Module mapping**: Les imports `@/*` sont résolus vers `src/*`
- **Coverage**: Collecte automatique sur `src/**/*.ts` (sauf tests et server.ts)

## Bonnes pratiques

1. **Nommage**: `*.test.ts` ou `*.spec.ts`
2. **Isolation**: Chaque test doit être indépendant
3. **Mocks**: Utiliser `jest.fn()` pour les dépendances externes
4. **Cleanup**: `jest.clearAllMocks()` est appelé automatiquement après chaque test
5. **Async**: Utiliser `async/await` pour les tests asynchrones
