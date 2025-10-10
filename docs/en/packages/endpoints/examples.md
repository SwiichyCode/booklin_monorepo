# Usage Examples for @repo/endpoints

## Backend Example (Express)

### Using in Routes

```typescript
// apps/api/src/adapters/in/http/routes/user.routes.ts
import { Router } from 'express';
import { endpoints } from '@repo/endpoints';
import { container } from '../../../../shared/di/container';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = container.resolve(UserController);

// Instead of hardcoding paths, use endpoints
router.post(
  endpoints.users.create.path,
  (req, res) => userController.createUser(req, res)
);

router.patch(
  endpoints.users.update.path,
  (req, res) => userController.updateUser(req, res)
);

router.delete(
  endpoints.users.delete.path,
  (req, res) => userController.deleteUser(req, res)
);

router.get(
  endpoints.users.getByClerkId.path,
  (req, res) => userController.getUserByClerkId(req, res)
);

router.get(
  endpoints.users.getById.path,
  (req, res) => userController.getUserById(req, res)
);

router.get(
  endpoints.users.getByEmail.path,
  (req, res) => userController.getUserByEmail(req, res)
);

router.get(
  endpoints.users.getAll.path,
  (req, res) => userController.getUsers(req, res)
);

export { router as userRoutes };
```

### Using in Main Router

```typescript
// apps/api/src/adapters/in/http/routes/index.ts
import { Router } from 'express';
import { buildApiUrl } from '@repo/endpoints';
import { userRoutes } from './user.routes';
import { webhooksRoutes } from './webhooks.routes';
import proProfileRoutes from './proProfile.routes';

const router = Router();

// Base paths are already defined in the endpoints package
router.use('/webhooks', webhooksRoutes);
router.use('/users', userRoutes);
router.use('/pro-profiles', proProfileRoutes);

export default router;
```

## Frontend Example (Next.js)

### 1. API Client Service

```typescript
// apps/web/src/lib/api/client.ts
import { endpoints, buildFullApiUrl } from '@repo/endpoints';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Helper to build a complete URL
   */
  private buildUrl(path: string): string {
    return buildFullApiUrl(this.baseUrl, path);
  }

  /**
   * Get all users
   */
  async getUsers() {
    const url = this.buildUrl(endpoints.users.getAll.build());
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }

  /**
   * Get a user by ID
   */
  async getUserById(id: string) {
    const url = this.buildUrl(endpoints.users.getById.build({ id }));
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch user ${id}`);
    return response.json();
  }

  /**
   * Get a user by Clerk ID
   */
  async getUserByClerkId(clerkId: string) {
    const url = this.buildUrl(endpoints.users.getByClerkId.build({ clerkId }));
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch user ${clerkId}`);
    return response.json();
  }

  /**
   * Update a user
   */
  async updateUser(clerkId: string, data: any) {
    const url = this.buildUrl(endpoints.users.update.build({ clerkId }));
    const response = await fetch(url, {
      method: endpoints.users.update.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update user ${clerkId}`);
    return response.json();
  }

  /**
   * Get all professional profiles with filters
   */
  async getProProfiles(filters?: {
    profession?: string;
    city?: string;
    isPremium?: boolean;
    validationStatus?: string;
    isActive?: boolean;
  }) {
    const queryParams = filters
      ? Object.fromEntries(
          Object.entries(filters)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        )
      : undefined;

    const url = this.buildUrl(
      endpoints.proProfiles.getAll.build(undefined, queryParams)
    );
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch pro profiles');
    return response.json();
  }

  /**
   * Get a professional profile by ID
   */
  async getProProfileById(id: string) {
    const url = this.buildUrl(endpoints.proProfiles.getById.build({ id }));
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch pro profile ${id}`);
    return response.json();
  }

  /**
   * Create a professional profile
   */
  async createProProfile(data: any) {
    const url = this.buildUrl(endpoints.proProfiles.create.build());
    const response = await fetch(url, {
      method: endpoints.proProfiles.create.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create pro profile');
    return response.json();
  }

  /**
   * Update a professional profile
   */
  async updateProProfile(id: string, data: any) {
    const url = this.buildUrl(endpoints.proProfiles.update.build({ id }));
    const response = await fetch(url, {
      method: endpoints.proProfiles.update.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update pro profile ${id}`);
    return response.json();
  }

  /**
   * Activate premium
   */
  async activatePremium(id: string) {
    const url = this.buildUrl(endpoints.proProfiles.activatePremium.build({ id }));
    const response = await fetch(url, {
      method: endpoints.proProfiles.activatePremium.method,
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`Failed to activate premium for ${id}`);
    return response.json();
  }
}

// Export a default instance
export const apiClient = new ApiClient();
```

### 2. React Query Hooks

```typescript
// apps/web/src/lib/api/queries/users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => apiClient.getUserById(id),
    enabled: !!id,
  });
}

export function useUserByClerkId(clerkId: string) {
  return useQuery({
    queryKey: ['user', 'clerk', clerkId],
    queryFn: () => apiClient.getUserByClerkId(clerkId),
    enabled: !!clerkId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clerkId, data }: { clerkId: string; data: any }) =>
      apiClient.updateUser(clerkId, data),
    onSuccess: (_, variables) => {
      // Invalidate cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['user', 'clerk', variables.clerkId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

```typescript
// apps/web/src/lib/api/queries/proProfiles.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

export function useProProfiles(filters?: {
  profession?: string;
  city?: string;
  isPremium?: boolean;
  validationStatus?: string;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: ['proProfiles', filters],
    queryFn: () => apiClient.getProProfiles(filters),
  });
}

export function useProProfile(id: string) {
  return useQuery({
    queryKey: ['proProfile', id],
    queryFn: () => apiClient.getProProfileById(id),
    enabled: !!id,
  });
}

export function useCreateProProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.createProProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proProfiles'] });
    },
  });
}

export function useUpdateProProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.updateProProfile(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proProfile', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['proProfiles'] });
    },
  });
}

export function useActivatePremium() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.activatePremium(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['proProfile', id] });
    },
  });
}
```

### 3. Using in Components

```typescript
// apps/web/src/app/dashboard/page.tsx
'use client';

import { useProProfiles } from '@/lib/api/queries/proProfiles';
import { useState } from 'react';

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    profession: undefined,
    city: undefined,
    isPremium: undefined,
  });

  const { data, isLoading, error } = useProProfiles(filters);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Professional Profiles</h1>

      {/* Filters */}
      <div>
        <select onChange={(e) => setFilters({ ...filters, profession: e.target.value })}>
          <option value="">All professions</option>
          <option value="hairdresser">Hairdresser</option>
          <option value="barber">Barber</option>
          <option value="masseuse">Masseuse</option>
        </select>
      </div>

      {/* Profile list */}
      <div>
        {data?.data?.map((profile: any) => (
          <div key={profile.id}>
            <h2>{profile.businessName}</h2>
            <p>{profile.profession}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

```typescript
// apps/web/src/app/pro/[id]/page.tsx
'use client';

import { useProProfile, useActivatePremium } from '@/lib/api/queries/proProfiles';
import { useParams } from 'next/navigation';

export default function ProProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useProProfile(id);
  const activatePremium = useActivatePremium();

  const handleActivatePremium = async () => {
    try {
      await activatePremium.mutateAsync(id);
      alert('Premium activated!');
    } catch (error) {
      alert('Error during activation');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data?.data?.businessName}</h1>
      <p>{data?.data?.bio}</p>

      {!data?.data?.isPremium && (
        <button
          onClick={handleActivatePremium}
          disabled={activatePremium.isPending}
        >
          {activatePremium.isPending ? 'Activating...' : 'Activate Premium'}
        </button>
      )}
    </div>
  );
}
```

### 4. Server Actions (Next.js)

```typescript
// apps/web/src/app/actions/proProfile.ts
'use server';

import { endpoints, buildFullApiUrl } from '@repo/endpoints';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function createProProfile(formData: FormData) {
  const data = {
    businessName: formData.get('businessName'),
    profession: formData.get('profession'),
    bio: formData.get('bio'),
    // ... other fields
  };

  const url = buildFullApiUrl(API_BASE_URL, endpoints.proProfiles.create.build());

  const response = await fetch(url, {
    method: endpoints.proProfiles.create.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create profile');
  }

  return response.json();
}
```

## Advantages of This Approach

1. **Type safety**: Parameters are typed (e.g., `{ id: string }`)
2. **Autocomplete**: IntelliSense suggests all available endpoints
3. **Single source of truth**: Changing a route = update everywhere
4. **Fewer errors**: Impossible to typo a URL
5. **Easy refactoring**: Renaming a route updates backend AND frontend
6. **Integrated documentation**: Descriptions are in the code
7. **Automatic URL encoding**: Parameters are encoded automatically
