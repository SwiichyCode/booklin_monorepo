# Booklin API

API backend pour la plateforme Booklin - Marketplace de professionnels du domicile.

## 🏗️ Architecture

Ce projet utilise une **architecture hexagonale** (ports & adapters) avec **injection de dépendances**.

### Structure

```
src/
├── core/              # Domaine métier (logique business)
├── adapters/          # Adaptateurs (HTTP, DB, etc.)
└── shared/            # Configuration & DI
```

📚 **Documentation détaillée** :
- [Architecture Hexagonale](./HEXAGONAL_ARCHITECTURE.md) - Structure et patterns
- [Configuration](./CONFIGURATION.md) - Variables d'env, CORS, middlewares

## 🚀 Démarrage rapide

### 1. Installation

```bash
pnpm install
```

### 2. Configuration

Copier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Remplir les variables obligatoires :
```env
DATABASE_URL=postgresql://user:password@localhost:5432/booklin_db
```

### 3. Base de données

```bash
# Générer le client Prisma
pnpm prisma generate

# Exécuter les migrations
pnpm prisma migrate dev

# (Optionnel) Ouvrir Prisma Studio
pnpm prisma studio
```

### 4. Lancer le serveur

```bash
pnpm dev
```

L'API sera accessible sur `http://localhost:4000`

## 📡 Endpoints

### Health Check
```bash
GET /health
```

### Users (Architecture Hexagonale)
```bash
POST   /api/users                    # Créer utilisateur
PATCH  /api/users/:clerkId          # Mettre à jour
DELETE /api/users/:clerkId          # Supprimer
GET    /api/users/clerk/:clerkId    # Par ClerkId
GET    /api/users/id/:id            # Par ID
GET    /api/users/email/:email      # Par Email
GET    /api/users                   # Liste
```

### Webhooks
```bash
POST /api/webhooks/clerk            # Webhooks Clerk
```

### Pro Profiles
```bash
# À documenter après migration architecture hexagonale
```

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests avec coverage
pnpm test:coverage

# Tests en watch mode
pnpm test:watch
```

## 🛠️ Stack technique

- **Runtime** : Node.js
- **Framework** : Express
- **Language** : TypeScript
- **ORM** : Prisma
- **Database** : PostgreSQL
- **DI** : TSyringe
- **Auth** : Clerk
- **Paiements** : Stripe

## 📦 Scripts disponibles

```bash
pnpm dev          # Démarrer en mode développement
pnpm build        # Build production
pnpm start        # Démarrer en production
pnpm lint         # Linter le code
pnpm format       # Formater le code
pnpm prisma       # Commandes Prisma
```

## 🔑 Principes d'architecture

### ✅ Ce qui est dans le domaine (`core/`)
- Entités métier riches
- Règles business
- Use Cases (interfaces)
- Value Objects

### ❌ Ce qui n'est PAS dans le domaine
- Prisma, Express, HTTP
- Détails d'infrastructure
- Configuration technique

### 🎯 Flux typique

```
HTTP Request
    ↓
Route → Controller (adapter IN)
    ↓
Use Case (port IN)
    ↓
Service (implémentation)
    ↓
Repository (port OUT)
    ↓
Prisma Repository (adapter OUT)
    ↓
Database
```

## 📝 Conventions

### Commits
```
feat: add user profile endpoint
fix: resolve booking date validation
chore: update dependencies
docs: update API documentation
```

### Nommage
- **Fichiers** : PascalCase pour composants, camelCase pour utils
- **Classes** : PascalCase
- **Variables** : camelCase
- **Constantes** : UPPER_SNAKE_CASE
- **Interfaces** : PascalCase sans préfixe `I`

## 🤝 Contribution

1. Créer une branche : `git checkout -b feat/ma-feature`
2. Commiter : `git commit -m "feat: add feature"`
3. Push : `git push origin feat/ma-feature`
4. Créer une Pull Request

## 📚 Ressources

- [Architecture Hexagonale](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://khalilstemmler.com/articles/domain-driven-design-intro/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

## 📄 Licence

Propriétaire - Booklin © 2025
