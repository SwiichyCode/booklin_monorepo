# 📋 TODO - Booklin MVP

> **Dernière mise à jour** : 8 octobre 2025
> **Focus actuel** : Gestion des professionnels

---

## 🎯 Phase 1 : Gestion des Professionnels

### 🏗️ Architecture & Modèles

- [✅] **1.1 - Enrichir le schéma Prisma ProProfile**
  - [✅] Ajouter champs validation entreprise (SIRET, raison sociale, statut validation)
  - [✅] Ajouter champs onboarding (étape actuelle, progression, isOnboardingComplete)
  - [✅] Ajouter champs complémentaires (description longue, années d'expérience, certifications)
  - [✅] Créer migration Prisma
  - [✅] Générer client Prisma

- [ ] **1.2 - Créer module `pro-profiles`**
  - [ ] `pro-profile.types.ts` (DTOs: CreateProProfileDTO, UpdateProProfileDTO, ValidationDTO)
  - [ ] `pro-profile.repository.ts` (CRUD Prisma)
  - [ ] `pro-profile.service.ts` (logique métier, validation)
  - [ ] `pro-profile.controller.ts` (endpoints HTTP)
  - [ ] `pro-profile.routes.ts` (définition routes)
  - [ ] `index.ts` (exports)

---

### 🏢 Intégration API INSEE

- [ ] **2.1 - Service INSEE**
  - [ ] Créer `services/insee/insee.service.ts`
  - [ ] Méthode `validateSIRET(siret: string)` → retourne données entreprise
  - [ ] Gestion des erreurs (SIRET invalide, entreprise non trouvée, API down)
  - [ ] Types TypeScript pour réponse API INSEE
  - [ ] Configuration ENV (INSEE_API_URL, clés si nécessaire)

- [ ] **2.2 - Logique validation**
  - [ ] Endpoint POST `/api/pros/validate-siret` (appelle INSEE avant création profil)
  - [ ] Stocker données INSEE dans ProProfile (raison sociale, adresse légale)
  - [ ] Gérer cas micro-entrepreneurs récents (fallback manual validation?)

---

### 🚀 Onboarding Multi-étapes

- [ ] **3.1 - Définir les étapes d'onboarding**
  - [ ] Étape 1 : Informations entreprise (SIRET, raison sociale, validation INSEE)
  - [ ] Étape 2 : Informations professionnelles (businessName, profession, bio, années expérience)
  - [ ] Étape 3 : Localisation (adresse, latitude, longitude, radius km)
  - [ ] Étape 4 : Médias (photos profil/travaux, portfolio)
  - [ ] Étape 5 : Validation finale & activation profil

- [ ] **3.2 - Logique de progression**
  - [ ] Champ `onboardingStep` (enum: ENTERPRISE_INFO, PROFESSIONAL_INFO, LOCATION, MEDIA, COMPLETED)
  - [ ] Champ `onboardingProgress` (0-100%)
  - [ ] Méthode `canProceedToNextStep()` dans service
  - [ ] Endpoint PATCH `/api/pros/onboarding/:step` (sauvegarde étape)
  - [ ] Endpoint GET `/api/pros/onboarding/status` (récupère progression)

- [ ] **3.3 - Validation par étape**
  - [ ] Schémas Zod pour chaque étape
  - [ ] Middleware validation par étape
  - [ ] Messages d'erreur clairs et actionnables

---

### 📡 API Endpoints

- [ ] **4.1 - CRUD Profil Pro**
  - [ ] `POST /api/pros` - Créer profil pro (démarre onboarding)
  - [ ] `GET /api/pros/:id` - Récupérer profil pro (public)
  - [ ] `GET /api/pros/me` - Récupérer son propre profil (authenticated)
  - [ ] `PATCH /api/pros/:id` - Mettre à jour profil (authenticated, owner only)
  - [ ] `DELETE /api/pros/:id` - Supprimer profil (authenticated, owner only)

- [ ] **4.2 - Onboarding**
  - [ ] `POST /api/pros/validate-siret` - Valider SIRET via INSEE
  - [ ] `PATCH /api/pros/onboarding/:step` - Sauvegarder étape onboarding
  - [ ] `GET /api/pros/onboarding/status` - Récupérer progression onboarding
  - [ ] `POST /api/pros/onboarding/complete` - Finaliser onboarding

- [ ] **4.3 - Gestion statut**
  - [ ] `PATCH /api/pros/:id/activate` - Activer profil (après onboarding)
  - [ ] `PATCH /api/pros/:id/deactivate` - Désactiver profil temporairement

---

### 🔐 Sécurité & Permissions

- [ ] **5.1 - Middlewares**
  - [ ] Middleware `requireRole('PRO')` pour routes pros uniquement
  - [ ] Middleware `isProfileOwner` (vérifier que req.user.id === profile.userId)
  - [ ] Middleware `requireOnboardingComplete` (bloquer actions si onboarding incomplet)

- [ ] **5.2 - Validation données**
  - [ ] Valider format SIRET (14 chiffres)
  - [ ] Valider coordonnées GPS (latitude/longitude valides)
  - [ ] Valider radius (entre 1 et 50 km par exemple)
  - [ ] Sanitize inputs (bio, description)

---

### 🎨 Gestion Médias (Photos)

- [ ] **6.1 - Upload photos**
  - [ ] Endpoint `POST /api/pros/:id/photos` (upload photo)
  - [ ] Validation taille/format (JPEG, PNG, max 5MB)
  - [ ] Stockage temporaire local (avant Cloudinary)
  - [ ] Array `photos[]` dans ProProfile
  - [ ] Limite nombre de photos (ex: max 10 photos)

- [ ] **6.2 - Gestion photos**
  - [ ] Endpoint `DELETE /api/pros/:id/photos/:photoId` (supprimer photo)
  - [ ] Endpoint `PATCH /api/pros/:id/photos/reorder` (réordonner photos)

---

### 📊 Logique Métier Spécifique

- [ ] **7.1 - Transition CLIENT → PRO**
  - [ ] Endpoint `POST /api/users/upgrade-to-pro` (change role USER)
  - [ ] Créer ProProfile associé
  - [ ] Gérer cas où user a déjà des bookings en tant que client
  - [ ] Notification email "Bienvenue chez les pros"

- [ ] **7.2 - Validation manuelle (Admin, futur)**
  - [ ] Champ `validationStatus` (PENDING, APPROVED, REJECTED)
  - [ ] Logique pour admin approve/reject
  - [ ] (Non prioritaire pour MVP, mais prévoir le champ)

---

### ✅ Tests

- [ ] **8.1 - Tests unitaires**
  - [ ] ProProfileService.createProfile()
  - [ ] ProProfileService.validateSIRET()
  - [ ] ProProfileService.updateOnboardingStep()
  - [ ] INSEEService.validateSIRET()

- [ ] **8.2 - Tests d'intégration**
  - [ ] POST /api/pros (création profil)
  - [ ] PATCH /api/pros/onboarding/:step (progression)
  - [ ] POST /api/pros/validate-siret (appel INSEE mock)

---

### 📖 Documentation

- [ ] **9.1 - API Documentation**
  - [ ] Documenter tous les endpoints dans README.md
  - [ ] Ajouter exemples de requêtes/réponses
  - [ ] Documenter codes d'erreur possibles

- [ ] **9.2 - Types partagés**
  - [ ] Exporter types ProProfile dans `packages/types` (si monorepo partagé)
  - [ ] Documenter structure onboarding steps

---

## 🚧 Bloqueurs / Questions en suspens

- [ ] **API INSEE** : Besoin de clé API ou endpoint public ?
- [ ] **Stockage photos** : Local pour MVP ou Cloudinary direct ?
- [ ] **Validation manuelle** : Process d'approbation admin nécessaire en MVP ?
- [ ] **Géolocalisation** : Géocodage automatique adresse → lat/lng (Google Maps API ?)

---

## 📈 Métriques de succès Phase 1

- [ ] Un USER peut créer un profil PRO
- [ ] Le SIRET est validé via API INSEE
- [ ] L'onboarding guide le pro sur 5 étapes
- [ ] Le profil PRO est visible publiquement après onboarding complet
- [ ] Un USER peut passer de CLIENT à PRO

---

## 🔄 Prochaines phases (après Phase 1)

### Phase 2 : Services & Grille Tarifaire
- Définir modèle de données Services
- CRUD Services par pro
- Affichage grille tarifaire

### Phase 3 : Disponibilités & Réservations
- Gestion horaires pros
- Système de booking
- Confirmation/annulation

### Phase 4 : Recherche & Filtres
- Recherche géolocalisée
- Filtres (profession, prix, note)
- Tri des résultats

### Phase 5 : Avis & Réputation
- Système de notation
- Reviews clients
- Modération

### Phase 6 : Messagerie
- Chat in-app
- Notifications
- Pièces jointes

### Phase 7 : Freemium & Abonnements
- Logique freemium (10 demandes/mois)
- Upgrade Premium
- Gestion abonnements

---

**💡 Conseil** : Compléter Phase 1 avant de passer à Phase 2. Chaque phase doit être fonctionnelle et testée.
