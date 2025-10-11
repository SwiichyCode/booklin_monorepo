# Fix : Gestion du chargement Clerk + React Query

## 🐛 Problème identifié

Au rafraîchissement de la page, on observe un flash d'erreur avant que les données ne se chargent correctement.

### Cause
1. **Clerk met du temps à s'initialiser** (`isLoaded = false`)
2. **React Query lance la requête avant** que `user?.id` soit disponible
3. La query échoue avec `"User not authenticated"` → Affichage de l'erreur
4. Ensuite Clerk finit de charger → `user?.id` disponible
5. React Query refetch automatiquement → Succès

---

## ✅ Solution implémentée

### **1. Hook `useProProfile` - Ajouter `enabled`**

**Fichier :** `apps/web/src/lib/hooks/useProProfile.ts`

```typescript
export function useProProfile() {
  const { user, isLoaded } = useUser(); // 👈 Récupérer isLoaded de Clerk

  return useQuery({
    queryKey: ['proProfile', 'user', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return proProfileService.getMyProfile(user.id);
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: isLoaded && !!user?.id, // 👈 Clé de la solution !
  });
}
```

**Explication :**
- `enabled: isLoaded && !!user?.id` empêche React Query de lancer la requête tant que :
  - Clerk n'est pas chargé (`isLoaded = false`)
  - OU l'utilisateur n'est pas identifié (`user?.id` est undefined)

---

### **2. Composant `ProOnboardingMain` - Gérer les états Clerk**

**Fichier :** `apps/web/src/components/features/pro-onboarding/pro-onboarding-main.tsx`

```typescript
export function ProOnboardingMain() {
  const { isLoaded: isClerkLoaded, user } = useUser(); // 👈 Récupérer Clerk state
  const { data: profileData, isLoading: isProfileLoading, isError } = useProProfile();

  // ... reste du code

  // 🔥 Afficher un loader pendant le chargement de Clerk OU du profil
  if (!isClerkLoaded || isProfileLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-lg font-semibold">
            {!isClerkLoaded ? 'Authentification en cours...' : 'Chargement de votre profil...'}
          </p>
        </div>
      </div>
    );
  }

  // 🔥 Si pas d'utilisateur connecté
  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-lg font-semibold">Vous devez être connecté pour accéder à cette page</p>
        </div>
      </div>
    );
  }

  // 🔥 Afficher une erreur si échec (uniquement après que Clerk soit chargé)
  if (isError) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Erreur lors du chargement du profil</p>
          <p className="text-sm mt-2">Veuillez réessayer plus tard</p>
        </div>
      </div>
    );
  }

  // Afficher le formulaire
  return (/* ... */);
}
```

**Changements :**
1. Importer `useUser` de `@clerk/nextjs`
2. Récupérer `isClerkLoaded` et `user`
3. Afficher un loader si Clerk n'est **PAS** encore chargé
4. Afficher un message si l'utilisateur n'est **PAS** connecté
5. N'afficher l'erreur de profile **QUE** si Clerk est chargé

---

## 🔄 Flow après le fix

```
1. Page mount
   └─> isClerkLoaded = false
   └─> Affiche : "Authentification en cours..."

2. Clerk se charge (0.5-1s)
   └─> isClerkLoaded = true
   └─> user?.id disponible

3. React Query déclenche la requête (grâce à `enabled`)
   └─> isProfileLoading = true
   └─> Affiche : "Chargement de votre profil..."

4. API répond
   └─> data disponible
   └─> Hydrate le store Zustand
   └─> Affiche le formulaire
```

**✅ Plus de flash d'erreur !**

---

## 📊 Diagramme des états

### **Avant le fix**

```
[Mount] → [Error "User not authenticated"] → [Clerk chargé] → [Refetch] → [Succès]
          ❌ Flash d'erreur visible
```

### **Après le fix**

```
[Mount] → [Loader Clerk] → [Clerk chargé] → [Loader Profile] → [Succès]
          ✅ Transition fluide
```

---

## 🧪 Comment tester

1. **Rafraîchir la page d'onboarding** (`http://localhost:3000/onboarding`)
   - ✅ Voir "Authentification en cours..." (rapide)
   - ✅ Voir "Chargement de votre profil..." (rapide)
   - ✅ Voir le formulaire avec les données

2. **Ouvrir les DevTools React Query**
   - La query `['proProfile', 'user', userId]` ne devrait s'exécuter **QUE** quand `user?.id` existe

3. **Console du navigateur**
   - Aucune erreur "User not authenticated"

---

## 🔑 Concepts clés

### **`enabled` dans React Query**

Le paramètre `enabled` permet de **contrôler** quand une query doit s'exécuter.

```typescript
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  enabled: someCondition, // Query s'exécute uniquement si true
});
```

**Use cases courants :**
- Attendre qu'une dépendance soit disponible (ex: userId)
- Désactiver temporairement une query
- Conditionner une query à une action utilisateur

### **`isLoaded` de Clerk**

Clerk expose `isLoaded` pour indiquer si l'initialisation est terminée :

```typescript
const { user, isLoaded } = useUser();

if (!isLoaded) {
  // Clerk est en train de charger, ne rien faire
  return <Loader />;
}

// Clerk est chargé, on peut utiliser `user` en toute sécurité
```

---

## 📚 Ressources

- [React Query - Dependent Queries](https://tanstack.com/query/latest/docs/react/guides/dependent-queries)
- [React Query - enabled option](https://tanstack.com/query/latest/docs/react/reference/useQuery#enabled)
- [Clerk - useUser hook](https://clerk.com/docs/references/react/use-user)

---

**✨ Fix appliqué avec succès ! L'expérience utilisateur est maintenant fluide.**
