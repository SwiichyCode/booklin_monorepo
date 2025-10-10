# Exemples d'utilisation de @repo/endpoints

> **📖 Documentation complète** : [🇬🇧 English](../../docs/en/packages/endpoints/examples.md) | [🇫🇷 Français](../../docs/fr/packages/endpoints/exemples.md)

## Exemple Backend (Express)

### Utilisation dans les routes

```typescript
// apps/api/src/adapters/in/http/routes/user.routes.ts
import { Router } from 'express';
import { endpoints } from '@repo/endpoints';
import { container } from '../../../../shared/di/container';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = container.resolve(UserController);

// Au lieu de hardcoder les paths, utiliser endpoints
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

### Utilisation dans le routeur principal

```typescript
// apps/api/src/adapters/in/http/routes/index.ts
import { Router } from 'express';
import { buildApiUrl } from '@repo/endpoints';
import { userRoutes } from './user.routes';
import { webhooksRoutes } from './webhooks.routes';
import proProfileRoutes from './proProfile.routes';

const router = Router();

// Les base paths sont déjà définis dans le package endpoints
router.use('/webhooks', webhooksRoutes);
router.use('/users', userRoutes);
router.use('/pro-profiles', proProfileRoutes);

export default router;
```

## Exemple Frontend (Next.js)

### 1. Service API Client

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
   * Helper pour construire une URL complète
   */
  private buildUrl(path: string): string {
    return buildFullApiUrl(this.baseUrl, path);
  }

  /**
   * Récupérer tous les utilisateurs
   */
  async getUsers() {
    const url = this.buildUrl(endpoints.users.getAll.build());
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getUserById(id: string) {
    const url = this.buildUrl(endpoints.users.getById.build({ id }));
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch user ${id}`);
    return response.json();
  }

  /**
   * Récupérer un utilisateur par Clerk ID
   */
  async getUserByClerkId(clerkId: string) {
    const url = this.buildUrl(endpoints.users.getByClerkId.build({ clerkId }));
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch user ${clerkId}`);
    return response.json();
  }

  /**
   * Mettre à jour un utilisateur
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
   * Récupérer tous les profils professionnels avec filtres
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
   * Récupérer un profil professionnel par ID
   */
  async getProProfileById(id: string) {
    const url = this.buildUrl(endpoints.proProfiles.getById.build({ id }));
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch pro profile ${id}`);
    return response.json();
  }

  /**
   * Créer un profil professionnel
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
   * Mettre à jour un profil professionnel
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
   * Activer premium
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

// Export d'une instance par défaut
export const apiClient = new ApiClient();
```

### 2. Hooks React Query

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
      // Invalider le cache pour rafraîchir les données
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

### 3. Utilisation dans les composants

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

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div>
      <h1>Profils professionnels</h1>

      {/* Filtres */}
      <div>
        <select onChange={(e) => setFilters({ ...filters, profession: e.target.value })}>
          <option value="">Toutes les professions</option>
          <option value="coiffeur">Coiffeur</option>
          <option value="barbier">Barbier</option>
          <option value="masseur">Masseur</option>
        </select>
      </div>

      {/* Liste des profils */}
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
      alert('Premium activé !');
    } catch (error) {
      alert('Erreur lors de l\'activation');
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div>
      <h1>{data?.data?.businessName}</h1>
      <p>{data?.data?.bio}</p>

      {!data?.data?.isPremium && (
        <button
          onClick={handleActivatePremium}
          disabled={activatePremium.isPending}
        >
          {activatePremium.isPending ? 'Activation...' : 'Activer Premium'}
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
    // ... autres champs
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

## Avantages de cette approche

1. **Type safety** : Les paramètres sont typés (ex: `{ id: string }`)
2. **Autocomplete** : IntelliSense suggère tous les endpoints disponibles
3. **Single source of truth** : Modification d'une route = mise à jour partout
4. **Moins d'erreurs** : Impossible de typo une URL
5. **Refactoring facile** : Renommer une route met à jour backend ET frontend
6. **Documentation intégrée** : Les descriptions sont dans le code
7. **URL encoding automatique** : Les paramètres sont encodés automatiquement
