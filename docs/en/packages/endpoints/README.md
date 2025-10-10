# @repo/endpoints

Centralized package for all Booklin API endpoints. This package ensures consistency between the backend (Express) and frontend (Next.js) by defining a single source of truth for all API routes.

## Installation

This package is already installed in the monorepo. To use it in a workspace:

```json
{
  "dependencies": {
    "@repo/endpoints": "workspace:*"
  }
}
```

## Usage

### Backend (Express)

```typescript
import { endpoints } from '@repo/endpoints';

// Use paths in route definitions
router.post(endpoints.users.create.path, ...);
router.get(endpoints.users.getById.path, ...);
router.patch(endpoints.proProfiles.update.path, ...);
```

### Frontend (Next.js / React)

```typescript
import { endpoints, buildFullApiUrl } from '@repo/endpoints';

// Build URLs for API requests
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Example 1: Simple GET
const response = await fetch(
  buildFullApiUrl(apiUrl, endpoints.users.getAll.build())
);

// Example 2: GET with route parameters
const userId = '123';
const url = buildFullApiUrl(
  apiUrl,
  endpoints.users.getById.build({ id: userId })
);
const response = await fetch(url);

// Example 3: GET with query params
const url = buildFullApiUrl(
  apiUrl,
  endpoints.proProfiles.getAll.build(undefined, {
    profession: 'hairdresser',
    city: 'Paris',
    isPremium: 'true'
  })
);
// Generates: http://localhost:4000/api/pro-profiles?profession=hairdresser&city=Paris&isPremium=true

// Example 4: POST/PATCH with parameters
const response = await fetch(
  buildFullApiUrl(apiUrl, endpoints.proProfiles.update.build({ id: '456' })),
  {
    method: endpoints.proProfiles.update.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ businessName: 'New Name' })
  }
);
```

### React Query (Example)

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
│   ├── types.ts          # TypeScript types and helpers
│   ├── config.ts         # Configuration (base path, helpers)
│   ├── users.ts          # User endpoints
│   ├── proProfiles.ts    # Professional profile endpoints
│   ├── webhooks.ts       # Webhook endpoints
│   └── index.ts          # Central export
├── package.json
├── tsconfig.json
└── README.md
```

## API

### Types

- `HttpMethod`: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
- `Endpoint<TParams>`: Type for an API endpoint
- `createEndpoint()`: Helper to create a typed endpoint

### Configuration

- `API_BASE_PREFIX`: '/api'
- `buildApiUrl(path)`: Adds /api prefix to path
- `buildFullApiUrl(baseUrl, path)`: Builds complete URL

### Available Endpoints

#### Users (`endpoints.users`)

- `create`: POST /users
- `update`: PATCH /users/:clerkId
- `delete`: DELETE /users/:clerkId
- `getByClerkId`: GET /users/clerk/:clerkId
- `getById`: GET /users/id/:id
- `getByEmail`: GET /users/email/:email
- `getAll`: GET /users

#### Pro Profiles (`endpoints.proProfiles`)

**CRUD**
- `create`: POST /pro-profiles
- `update`: PATCH /pro-profiles/:id
- `delete`: DELETE /pro-profiles/:id
- `getById`: GET /pro-profiles/:id
- `getByUserId`: GET /pro-profiles/user/:userId
- `getAll`: GET /pro-profiles

**Approval**
- `approve`: POST /pro-profiles/:id/approve
- `reject`: POST /pro-profiles/:id/reject

**Premium**
- `activatePremium`: POST /pro-profiles/:id/premium/activate
- `renewPremium`: POST /pro-profiles/:id/premium/renew
- `deactivatePremium`: POST /pro-profiles/:id/premium/deactivate

#### Webhooks (`endpoints.webhooks`)

- `clerk`: POST /webhooks/clerk
- `stripe`: POST /webhooks/stripe

## Advantages

1. **Type-safety**: Route parameters are typed
2. **Single source of truth**: One definition for backend and frontend
3. **Autocomplete**: IntelliSense in VS Code
4. **Easy refactoring**: Changing a route updates everywhere
5. **Documentation**: Integrated descriptions for each endpoint
6. **Security**: Automatic URL encoding of parameters

## Adding a New Endpoint

```typescript
// In src/users.ts (or create a new file)
export const userEndpoints = {
  // ... existing endpoints

  /**
   * @route   GET /api/users/:id/profile
   * @desc    Get complete user profile
   * @access  Public
   */
  getProfile: createEndpoint<{ id: string }>('GET', `${BASE_PATH}/:id/profile`, {
    description: "Get complete user profile",
    access: 'public',
  }),
};
```

Don't forget to update the index file if you create a new module!
