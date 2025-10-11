# React Query + Zustand Setup - Documentation

## 🎯 Architecture mise en place

Cette documentation explique comment React Query et Zustand travaillent ensemble pour gérer les données du profil professionnel.

---

## 📦 Packages installés

```bash
pnpm --filter=web add @tanstack/react-query @tanstack/react-query-devtools
```

---

## 🏗️ Structure

```
apps/web/src/
├── lib/
│   ├── providers/
│   │   └── react-query.provider.tsx     # QueryClient Provider + DevTools
│   ├── hooks/
│   │   └── useProProfile.ts             # Hooks React Query
│   ├── stores/
│   │   └── useProOnBoardingStore.ts     # Store Zustand
│   └── services/
│       └── proProfile.service.ts        # API calls
└── components/
    └── features/
        └── pro-onboarding/
            ├── pro-onboarding-main.tsx  # Composant principal
            ├── test-profile-fetch.tsx   # Composant de test
            └── steps/
                └── enterprise-info-step.tsx
```

---

## 🔄 Flow de données

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. ProOnboardingMain (Component)                       │
│     │                                                   │
│     ├──> useProProfile() [React Query]                 │
│     │    │                                              │
│     │    ├─> Fetch API: proProfileService.getMyProfile()│
│     │    ├─> Cache automatique                          │
│     │    ├─> Gestion des états (loading, error, data)  │
│     │    └─> Refetch automatique selon config          │
│     │                                                   │
│     └──> useEffect()                                    │
│          │                                              │
│          └─> hydrateFromReactQuery(profileData)        │
│              │                                          │
│              └──> Zustand Store                         │
│                   │                                     │
│                   ├─> formData (édition locale)        │
│                   ├─> currentStep                       │
│                   └─> completedSteps                    │
│                                                         │
│  2. EnterpriseInfoStep (Formulaire)                     │
│     │                                                   │
│     ├──> Lit depuis Zustand Store                      │
│     ├──> useForm() avec defaultValues du store         │
│     ├──> useEffect() pour réhydratation                │
│     └──> onSubmit: updateFormData() → API              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Responsabilités

### React Query
- ✅ **Fetch des données** depuis l'API
- ✅ **Cache automatique** (5 minutes par défaut)
- ✅ **États de chargement** (loading, error, success)
- ✅ **Refetch intelligent** (focus, reconnexion)
- ✅ **Retry automatique** en cas d'erreur
- ✅ **DevTools** pour débugger

### Zustand
- ✅ **État local du formulaire** pendant l'édition
- ✅ **Navigation entre steps**
- ✅ **Tracking des steps complétés**
- ✅ **Persistence localStorage** (fallback)

---

## 🚀 Utilisation

### 1. Page de test

Visiter : `http://localhost:3000/test/profile-fetch`

Cette page permet de :
- Tester l'appel API `getMyProfile()`
- Voir les données retournées
- Observer le cache React Query
- Débugger les erreurs

### 2. Onboarding flow

Le composant `ProOnboardingMain` :
1. Charge automatiquement le profil au montage via `useProProfile()`
2. Affiche un loader pendant le fetch
3. Hydrate le store Zustand avec les données
4. Les formulaires se remplissent automatiquement

### 3. Dans les formulaires

Les steps (ex: `EnterpriseInfoStep`) :
- Lisent les données depuis Zustand
- Utilisent `useEffect` pour se réhydrater si les données changent
- Mettent à jour le store local pendant l'édition
- Envoient à l'API à la soumission

---

## 🔧 Configuration

### React Query Provider

`apps/web/src/lib/providers/react-query.provider.tsx`

```typescript
const [queryClient] = useState(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,        // 1 minute
          refetchOnWindowFocus: false, // Désactivé
          retry: 1,                    // 1 retry
        },
      },
    }),
);
```

### Hook useProProfile

`apps/web/src/lib/hooks/useProProfile.ts`

```typescript
export function useProProfile() {
  return useQuery({
    queryKey: ['proProfile', 'user'],
    queryFn: () => proProfileService.getMyProfile(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

### Store Zustand

`apps/web/src/lib/stores/useProOnBoardingStore.ts`

```typescript
hydrateFromReactQuery: (profileData: ProProfileResponse) => {
  set({
    formData: { /* mapping des données */ },
    currentStep: profileData.onboardingStep,
    completedSteps: new Set(profileData.completedSteps),
  });
}
```

---

## 🎨 Patterns utilisés

### Pattern 1: Hydratation au montage

```typescript
// Dans ProOnboardingMain
const { data, isLoading, isError } = useProProfile();

useEffect(() => {
  if (data) {
    hydrateFromReactQuery(data);
  }
}, [data, hydrateFromReactQuery]);
```

### Pattern 2: Réhydratation du formulaire

```typescript
// Dans EnterpriseInfoStep
useEffect(() => {
  if (formData.enterpriseInfo) {
    form.reset(formData.enterpriseInfo);
  }
}, [formData.enterpriseInfo, form]);
```

### Pattern 3: Mutation avec cache update

```typescript
export function useUpdateProfileStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ step, data }) =>
      proProfileService.updateProfileStep(step, data),

    onSuccess: (updatedProfile) => {
      // Met à jour le cache directement
      queryClient.setQueryData(['proProfile', 'user'], updatedProfile);
    },
  });
}
```

---

## 🐛 Debug

### React Query DevTools

Appuyer sur le bouton flottant en bas à droite de l'écran pour ouvrir les DevTools.

Tu peux voir :
- Les queries actives
- Le statut du cache
- Les données cached
- Les erreurs
- Les refetch

### Console logs

Ajouter dans le composant :
```typescript
const { data, isLoading, isError, error } = useProProfile();

console.log('Profile data:', data);
console.log('Is loading:', isLoading);
console.log('Error:', error);
```

---

## ✅ Avantages de cette architecture

1. **Séparation des responsabilités**
   - React Query = Serveur state
   - Zustand = Client state

2. **Cache automatique**
   - Pas de requêtes redondantes
   - Performance optimale

3. **Type-safety**
   - TypeScript sur toute la chaîne
   - Autocomplete partout

4. **DX (Developer Experience)**
   - DevTools intégrées
   - États gérés automatiquement

5. **Scalabilité**
   - Facile d'ajouter de nouveaux endpoints
   - Pattern réutilisable

---

## 🔮 Évolutions possibles

### 1. Optimistic updates

```typescript
const mutation = useMutation({
  mutationFn: updateProfile,
  onMutate: async (newData) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries(['proProfile', 'user']);

    // Snapshot previous value
    const previous = queryClient.getQueryData(['proProfile', 'user']);

    // Optimistically update
    queryClient.setQueryData(['proProfile', 'user'], newData);

    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['proProfile', 'user'], context.previous);
  },
});
```

### 2. Prefetching

```typescript
const queryClient = useQueryClient();

// Prefetch avant navigation
await queryClient.prefetchQuery({
  queryKey: ['proProfile', 'user'],
  queryFn: proProfileService.getMyProfile,
});
```

### 3. Polling

```typescript
useQuery({
  queryKey: ['proProfile', 'user'],
  queryFn: proProfileService.getMyProfile,
  refetchInterval: 30000, // Refetch toutes les 30 secondes
});
```

---

## 📚 Ressources

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Query + Zustand Pattern](https://tkdodo.eu/blog/using-zustand-with-react-query)

---

**✨ Setup terminé ! L'application est prête pour tester l'hydratation du profil pro.**
