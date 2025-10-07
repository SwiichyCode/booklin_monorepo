# CLAUDE.md - Contexte Projet

> **Dernière mise à jour :** 7 octobre 2025  
> **Version :** 0.1.0 (MVP en développement)

---

## 🎯 VUE D'ENSEMBLE

### Nom du projet
Booklin

### Pitch en une ligne
Marketplace SaaS qui met en relation des professionnels du domicile (coiffeurs, barbiers, masseurs, etc.) avec des clients particuliers, via un **modèle d'abonnement** (pas de commission sur prestations).

### Problème résolu
- **Pour les pros :** Wecasa prend 25% de commission → Notre solution : abonnement fixe 49€/mois, ils gardent 100% de leurs revenus
- **Pour les clients :** Difficile de trouver des pros de confiance à proximité → Notre solution : plateforme centralisée avec avis vérifiés

### Différenciation clé vs Wecasa (concurrent principal)
1. **Modèle économique** : Abonnement mensuel au lieu de commission 25%
2. **Choix du pro** : Client choisit son pro dès la 1ère réservation
3. **Support humain** : Service client accessible par téléphone
4. **Sélection qualité** : Vetting strict des professionnels

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Stack

**Frontend (apps/web)**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui (composants)
- Zustand (state management)

**Backend (apps/api)**
- Node.js
- Express
- TypeScript
- PostgreSQL (via Prisma ORM)
- Socket.io (messagerie temps réel - à venir)
- Redis (cache - à venir)

**Infrastructure**
- Monorepo : Turborepo + pnpm workspaces
- Auth : Clerk (ou NextAuth - à décider)
- Paiements : Stripe (abonnements)
- Images : Cloudinary
- Emails : SendGrid
- Maps : Google Maps API
- Déploiement : Vercel (frontend) + Railway (backend)

### Structure du monorepo

```
ton-projet/
├── apps/
│   ├── web/                 # Frontend Next.js
│   │   ├── app/            # Pages (App Router)
│   │   ├── components/     # Composants React
│   │   ├── lib/            # Utils & helpers
│   │   └── public/         # Assets statiques
│   │
│   └── api/                 # Backend Express
│       └── src/
│           ├── controllers/ # Logique métier
│           ├── routes/      # Définition routes
│           ├── middleware/  # Auth, validation, etc.
│           ├── services/    # Services externes
│           ├── models/      # Prisma client
│           └── server.ts    # Entry point
│
├── packages/
│   ├── types/              # Types TypeScript partagés
│   ├── ui/                 # Composants partagés (futur)
│   └── config/             # Configs ESLint, TS, etc.
│
├── turbo.json              # Config Turborepo
└── package.json            # Root package.json
```

---

## 💾 MODÈLE DE DONNÉES

### Entités principales

**User**
- id, email, password (hashed), role (CLIENT/PRO)
- firstName, lastName, phone, avatar
- createdAt, updatedAt

**ProProfile** (extend User si role=PRO)
- businessName, bio, profession
- address, latitude, longitude, radius (km)
- photos[] (URLs)
- isPremium (boolean), subscriptionEnd (date)
- rating (float), reviewCount (int)

**Service**
- id, proId (FK)
- name, description, price, duration (minutes)

**Booking**
- id, clientId (FK), proId (FK), serviceId (FK)
- date, startTime, endTime
- status (PENDING/CONFIRMED/CANCELLED/COMPLETED)
- clientMessage (optional)

**Review**
- id, bookingId (FK unique), clientId (FK), proId (FK)
- rating (1-5), comment (optional)

**Message**
- id, senderId (FK), conversationId (FK)
- content, read (boolean)

**Conversation**
- id, clientId (FK), proId (FK)
- Unique constraint (clientId, proId)

---

## 💰 MODÈLE BUSINESS

### Revenus

**Freemium pour pros :**
- **FREE** : Gratuit, 10 demandes/mois max, position aléatoire
- **PREMIUM** : 49€/mois, demandes illimitées, boost recherche, stats, etc.

**Pas de commission** sur les transactions client-pro (paiement direct hors plateforme).

### Timeline monétisation

- **Mois 0-6** : Tout GRATUIT (construction marketplace)
- **Mois 6-9** : Introduction freemium progressif
- **Mois 9+** : Freemium actif avec objectif 10-20% conversion

### Objectifs financiers Année 1

- 200 pros actifs
- 20-40 pros Premium (10-20% conversion)
- 1 000€ MRR (Monthly Recurring Revenue)

---

## 🎨 CONVENTIONS DE CODE

### TypeScript

**Strict mode activé**
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true
}
```

**Types partagés dans `packages/types`**
```typescript
// Importer depuis n'importe où
import { User, Booking, BookingStatus } from '@repo/types';
```

### Naming conventions

**Fichiers**
- Composants : `PascalCase.tsx` (ex: `ProCard.tsx`)
- Utils : `camelCase.ts` (ex: `formatDate.ts`)
- Routes API : `kebab-case.ts` (ex: `user-controller.ts`)

**Variables**
- `camelCase` pour variables et fonctions
- `PascalCase` pour composants et classes
- `UPPER_SNAKE_CASE` pour constantes

**Routes API**
```
GET    /api/pros          → Liste pros
GET    /api/pros/:id      → Détails pro
POST   /api/bookings      → Créer réservation
PATCH  /api/bookings/:id  → Modifier réservation
```

### Composants React

**Structure recommandée**
```typescript
// components/pro/ProCard.tsx
import { ProProfile } from '@repo/types';

interface ProCardProps {
  pro: ProProfile;
  onBook?: () => void;
}

export function ProCard({ pro, onBook }: ProCardProps) {
  // Logic
  return (
    // JSX
  );
}
```

**Pas de default exports sauf pour pages Next.js**

### API Routes (Express)

**Structure controller**
```typescript
// controllers/booking.controller.ts
import { Request, Response } from 'express';
import { CreateBookingDTO } from '@repo/types';

export const createBooking = async (
  req: Request<{}, {}, CreateBookingDTO>,
  res: Response
) => {
  try {
    // Logic
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

**Format réponses API standardisé**
```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: "Message d'erreur" }
```

---

## 🔐 ENVIRONNEMENT & SECRETS

### Variables d'environnement

**apps/web/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_MAPS_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
```

**apps/api/.env**
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
JWT_SECRET=...
STRIPE_SECRET_KEY=...
SENDGRID_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
```

**⚠️ CRITIQUE : Ne JAMAIS commit les .env**

Toujours créer `.env.example` avec des placeholders :
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-here
```

---

## 🚀 COMMANDES ESSENTIELLES

### Installation
```bash
pnpm install
```

### Développement
```bash
# Tout lancer (frontend + backend)
pnpm dev

# Frontend uniquement
pnpm dev --filter=web

# Backend uniquement
pnpm dev --filter=api
```

### Build
```bash
pnpm build
```

### Base de données (Prisma)
```bash
# Générer client Prisma
pnpm --filter=api prisma generate

# Créer migration
pnpm --filter=api prisma migrate dev --name nom_migration

# Ouvrir Prisma Studio
pnpm --filter=api prisma studio
```

### Lint & Format
```bash
pnpm lint
pnpm format
```

---

## 📦 GESTION DES PACKAGES

### Ajouter une dépendance

**Dans le frontend**
```bash
pnpm --filter=web add package-name
```

**Dans le backend**
```bash
pnpm --filter=api add package-name
```

**Dans types partagés**
```bash
pnpm --filter=@repo/types add package-name
```

### Ajouter dev dependency à la racine
```bash
pnpm add -D -w package-name
```

---

## 🎯 ROADMAP MVP (Phase 1)

### Fonctionnalités essentielles

**✅ Fait**
- [x] Setup monorepo Turborepo
- [x] Frontend Next.js + Shadcn
- [x] Backend Express + TypeScript

**🚧 En cours**
- [ ] Auth (Clerk ou NextAuth)
- [ ] Base de données PostgreSQL + Prisma
- [ ] Schéma DB complet

**📋 À faire (MVP)**
- [ ] Pages : Homepage, Recherche, Profil pro, Dashboard
- [ ] Profil pro (création + affichage public)
- [ ] Système de réservation basique
- [ ] Messagerie in-app
- [ ] Système d'avis
- [ ] Calendrier disponibilités

**🎯 Objectif :** MVP fonctionnel en 2-3 mois

---

## 🧪 TESTS

### Stratégie de test (À mettre en place)

**Backend**
- Jest pour tests unitaires
- Supertest pour tests API

**Frontend**
- React Testing Library
- Playwright pour E2E (plus tard)

**À prioriser en MVP :**
- Tests critiques uniquement (auth, paiements)
- Tests complets après validation marché

---

## 🐛 DEBUGGING

### Frontend (Next.js)

**Console errors**
```bash
# Vérifier logs terminal
pnpm dev --filter=web
```

**React DevTools**
- Installer extension Chrome
- Inspecter composants et state

### Backend (Express)

**Logs**
```typescript
// Ajouter des console.log stratégiques
console.log('[DEBUG] User data:', userData);
```

**Postman / Thunder Client**
- Tester routes API directement
- Voir réponses et erreurs

### Base de données

**Prisma Studio**
```bash
pnpm --filter=api prisma studio
```
Ouvre interface graphique pour voir/éditer données

---

## 📚 RESSOURCES & DOCUMENTATION

### Documentation officielle
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Turborepo Docs](https://turbo.build/repo/docs)

### Patterns & Best Practices
- [Next.js Patterns](https://nextjs.org/docs/app/building-your-application)
- [React Patterns](https://www.patterns.dev/)
- [API Design Best Practices](https://swagger.io/resources/articles/best-practices-in-api-design/)

### Inspiration
- Wecasa : https://www.wecasa.fr/
- Treatwell : https://www.treatwell.fr/

---

## 🚨 PROBLÈMES CONNUS & SOLUTIONS

### "Module not found" après ajout package
```bash
# Solution : Réinstaller
rm -rf node_modules
pnpm install
```

### Hot reload ne fonctionne pas
```bash
# Solution : Restart dev server
# Ctrl+C puis pnpm dev
```

### Prisma client out of sync
```bash
# Solution : Régénérer
pnpm --filter=api prisma generate
```

### CORS errors frontend → backend
```typescript
// Vérifier dans apps/api/src/server.ts
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## 📋 CHECKLIST AVANT COMMIT

Avant chaque commit, vérifie :

- [ ] Code compilé sans erreurs TypeScript
- [ ] Pas de console.log oubliés (sauf debug intentionnel)
- [ ] Variables sensibles pas dans le code (utiliser .env)
- [ ] Lint passing : `pnpm lint`
- [ ] Build fonctionne : `pnpm build`
- [ ] Message de commit descriptif

**Format commit messages :**
```
feat: add user profile page
fix: resolve booking date bug
chore: update dependencies
docs: update README
```

---

## 🎓 POUR LES NOUVEAUX CONTRIBUTEURS

### Onboarding rapide

**1. Clone & Install (10 min)**
```bash
git clone [repo-url]
cd ton-projet
pnpm install
```

**2. Setup environnement (15 min)**
- Copier `.env.example` → `.env` dans `apps/web` et `apps/api`
- Remplir les variables (demander les secrets à l'équipe)

**3. Lancer en local (5 min)**
```bash
pnpm dev
```
- Frontend : http://localhost:3000
- Backend : http://localhost:4000

**4. Lire la documentation (30 min)**
- Ce fichier CLAUDE.md (contexte)
- README.md (instructions)
- Architecture dans `/docs` (si existe)

**5. Premier ticket (1h)**
- Prendre un ticket "good first issue"
- Créer une branche : `git checkout -b feat/ton-ticket`
- Coder, tester, commit, push, PR

---

## 💡 DÉCISIONS IMPORTANTES PRISES

### Pourquoi Turborepo ?
- Performance (cache intelligent)
- Scalabilité future (plusieurs apps/packages)
- Industrie standard pour monorepos modernes

### Pourquoi Next.js App Router ?
- SSR natif (meilleur SEO pour marketplace)
- Performance (Server Components)
- Future-proof (direction officielle Next.js)

### Pourquoi pas de commission ?
- Différenciation forte vs Wecasa
- Meilleure marge pour les pros (attraction)
- Revenus récurrents prévisibles (SaaS)

### Pourquoi Prisma ?
- Type-safety avec TypeScript
- Migrations faciles
- Excellent DX
- Prisma Studio pour debugging

### Pourquoi Express (pas tRPC/GraphQL) ?
- Simplicité pour MVP
- Équipe habituée REST
- Évolutif si besoin plus tard

---

## 🔮 ÉVOLUTIONS FUTURES (Post-MVP)

**Phase 2 (Mois 3-6)**
- Statistiques avancées pros
- Templates messages automatiques
- Sync Google/Apple Calendar
- Notifications push (PWA)

**Phase 3 (Mois 6-12)**
- Application mobile native (React Native ou Flutter)
- Programme de fidélité
- Système de parrainage
- CRM intégré pour pros

**Phase 4 (Année 2+)**
- Expansion internationale
- API publique pour partenaires
- White-label pour grandes entreprises
- Intelligence artificielle (matching automatique)

---

## 📞 CONTACT & SUPPORT

### Questions techniques
- Créer une issue GitHub
- Tag avec label approprié (bug, question, enhancement)

### Discussions architecture
- GitHub Discussions
- Réunions hebdomadaires (si équipe)

### Urgences
- [À définir : email, Slack, Discord ?]

---

## 🎉 PHILOSOPHIE PROJET

### Valeurs

**1. User-first**
- Toujours tester avec de vrais utilisateurs
- Mesurer tout (analytics partout)
- Itérer rapidement sur feedback

**2. Qualité > Quantité**
- Mieux vaut 5 features excellentes que 20 médiocres
- Code maintenable > code rapide
- Tests sur fonctionnalités critiques

**3. Simplicité**
- KISS (Keep It Simple, Stupid)
- Pas d'over-engineering
- Résoudre le problème réel, pas un problème imaginaire

**4. Transparence**
- Build in public
- Documentation à jour
- Décisions expliquées

### Mindset

> "Make it work, make it right, make it fast" — Kent Beck

1. **Make it work** : MVP fonctionnel d'abord
2. **Make it right** : Refacto et tests ensuite
3. **Make it fast** : Optimisation quand nécessaire

---

## 📊 MÉTRIQUES CLÉS À SUIVRE

### Product Metrics
- Nombre inscriptions pros/semaine
- Nombre inscriptions clients/semaine
- Taux conversion demande → réservation
- NPS (Net Promoter Score)

### Business Metrics
- MRR (Monthly Recurring Revenue)
- Taux conversion Free → Premium
- Churn rate Premium
- LTV (Lifetime Value) pro

### Tech Metrics
- Uptime (objectif 99.9%)
- Temps réponse API (objectif <200ms)
- Core Web Vitals (Lighthouse >90)

---

**🚀 Bienvenue dans le projet ! Let's build something great. 💪**

---

*Ce fichier est un document vivant. Mets-le à jour régulièrement au fur et à mesure que le projet évolue.*