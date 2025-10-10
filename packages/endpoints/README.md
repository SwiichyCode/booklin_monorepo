# @repo/endpoints

> **📖 Documentation complète** : [🇬🇧 English](../../docs/en/packages/endpoints/README.md) | [🇫🇷 Français](../../docs/fr/packages/endpoints/README.md)

Package centralisé pour tous les endpoints API de Booklin. Ce package permet de garantir la cohérence entre le backend (Express) et le frontend (Next.js) en définissant une seule source de vérité pour toutes les routes API.

## Installation

Ce package est déjà installé dans le monorepo. Pour l'utiliser dans un workspace :

```json
{
  "dependencies": {
    "@repo/endpoints": "workspace:*"
  }
}
```

## Utilisation

### Backend (Express)

```typescript
import { endpoints } from '@repo/endpoints';

// Utiliser les paths dans les définitions de routes
router.post(endpoints.users.create.path, ...);
router.get(endpoints.users.getById.path, ...);
router.patch(endpoints.proProfiles.update.path, ...);
```

### Frontend (Next.js / React)

```typescript
import { endpoints, buildFullApiUrl } from '@repo/endpoints';

// Construire des URLs pour les requêtes API
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Exemple 1 : GET simple
const response = await fetch(
  buildFullApiUrl(apiUrl, endpoints.users.getAll.build())
);

// Exemple 2 : GET avec paramètres de route
const userId = '123';
const url = buildFullApiUrl(
  apiUrl,
  endpoints.users.getById.build({ id: userId })
);
const response = await fetch(url);

// Exemple 3 : GET avec query params
const url = buildFullApiUrl(
  apiUrl,
  endpoints.proProfiles.getAll.build(undefined, {
    profession: 'coiffeur',
    city: 'Paris',
    isPremium: 'true'
  })
);
// Génère : http://localhost:4000/api/pro-profiles?profession=coiffeur&city=Paris&isPremium=true

// Exemple 4 : POST/PATCH avec paramètres
const response = await fetch(
  buildFullApiUrl(apiUrl, endpoints.proProfiles.update.build({ id: '456' })),
  {
    method: endpoints.proProfiles.update.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ businessName: 'New Name' })
  }
);
```

### React Query (Exemple)

```typescript
import { useQuery } from '@tanstack/react-query';
import { endpoints, buildFullApiUrl } from '@repo/endpoints';

const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

function useProProfile(id: string) {
  return useQuery({
    queryKey: ['proProfile', id],
    queryFn: async () => {
      const url = buildFullApiUrl(
        apiUrl,
        endpoints.proProfiles.getById.build({ id })
      );
      const res = await fetch(url);
      return res.json();
    }
  });
}
```

## Structure

```
packages/endpoints/
├── src/
│   ├── types.ts          # Types TypeScript et helpers
│   ├── config.ts         # Configuration (base path, helpers)
│   ├── users.ts          # Endpoints utilisateurs
│   ├── proProfiles.ts    # Endpoints profils professionnels
│   ├── webhooks.ts       # Endpoints webhooks
│   └── index.ts          # Export central
├── package.json
├── tsconfig.json
└── README.md
```

## API

### Types

- `HttpMethod` : 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
- `Endpoint<TParams>` : Type pour un endpoint API
- `createEndpoint()` : Helper pour créer un endpoint typé

### Configuration

- `API_BASE_PREFIX` : '/api'
- `buildApiUrl(path)` : Ajoute le préfixe /api au chemin
- `buildFullApiUrl(baseUrl, path)` : Construit l'URL complète

### Endpoints disponibles

#### Users (`endpoints.users`)

- `create` : POST /users
- `update` : PATCH /users/:clerkId
- `delete` : DELETE /users/:clerkId
- `getByClerkId` : GET /users/clerk/:clerkId
- `getById` : GET /users/id/:id
- `getByEmail` : GET /users/email/:email
- `getAll` : GET /users

#### Pro Profiles (`endpoints.proProfiles`)

**CRUD**
- `create` : POST /pro-profiles
- `update` : PATCH /pro-profiles/:id
- `delete` : DELETE /pro-profiles/:id
- `getById` : GET /pro-profiles/:id
- `getByUserId` : GET /pro-profiles/user/:userId
- `getAll` : GET /pro-profiles

**Approval**
- `approve` : POST /pro-profiles/:id/approve
- `reject` : POST /pro-profiles/:id/reject

**Premium**
- `activatePremium` : POST /pro-profiles/:id/premium/activate
- `renewPremium` : POST /pro-profiles/:id/premium/renew
- `deactivatePremium` : POST /pro-profiles/:id/premium/deactivate

#### Webhooks (`endpoints.webhooks`)

- `clerk` : POST /webhooks/clerk
- `stripe` : POST /webhooks/stripe

## Avantages

1. **Type-safety** : Les paramètres de route sont typés
2. **Single source of truth** : Une seule définition pour backend et frontend
3. **Autocomplete** : IntelliSense dans VS Code
4. **Refactoring facile** : Changer une route met à jour partout
5. **Documentation** : Descriptions intégrées pour chaque endpoint
6. **Sécurité** : URL encoding automatique des paramètres

## Ajouter un nouveau endpoint

```typescript
// Dans src/users.ts (ou créer un nouveau fichier)
export const userEndpoints = {
  // ... endpoints existants

  /**
   * @route   GET /api/users/:id/profile
   * @desc    Récupérer le profil complet d'un utilisateur
   * @access  Public
   */
  getProfile: createEndpoint<{ id: string }>('GET', `${BASE_PATH}/:id/profile`, {
    description: "Récupérer le profil complet d'un utilisateur",
    access: 'public',
  }),
};
```

N'oubliez pas de mettre à jour le fichier d'index si vous créez un nouveau module !
