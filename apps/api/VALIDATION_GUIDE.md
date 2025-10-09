# 🛡️ Guide de Validation - Architecture Hexagonale

## 🎯 Principe : Validation à plusieurs niveaux

Dans l'architecture hexagonale, la validation se fait à **DEUX niveaux** :

```
HTTP Request
    ↓
1. VALIDATION HTTP (Zod) ← Dans le Controller (adapters/in)
    ↓
2. VALIDATION MÉTIER ← Dans les Entités du Domaine (core/domain)
    ↓
Use Case → Repository → Database
```

---

## 📊 Deux types de validation

### 1. **Validation HTTP (Controller - Adaptateur)**
- **Où** : `adapters/in/http/validation/`
- **Outil** : Zod
- **Rôle** : Valider la **structure** et le **format** des données HTTP
- **Exemples** :
  - Email format valide
  - Champs requis présents
  - Types corrects (string, number, etc.)
  - Enum values valides (CLIENT, PRO)
  - URL valide

### 2. **Validation Métier (Domain - Core)**
- **Où** : `core/domain/entities/` et `core/domain/value-objects/`
- **Outil** : Classes TypeScript + logique métier
- **Rôle** : Valider les **règles business**
- **Exemples** :
  - Email pas déjà utilisé (vérifié en DB)
  - Utilisateur peut changer de rôle selon son état
  - Un pro peut avoir max X services actifs
  - Une réservation doit être dans le futur

---

## 🔥 Exemple : Pourquoi les deux sont nécessaires ?

### Requête invalide : `role: "CLIEN"` (faute de frappe)

```typescript
// ❌ SANS validation Zod
POST /api/users
{
  "clerkId": "user_123",
  "email": "test@example.com",
  "role": "CLIEN"  // ← Typo !
}

// Résultat : Données insérées en DB avec role invalide !
// Erreur découverte plus tard, données corrompues
```

```typescript
// ✅ AVEC validation Zod
POST /api/users
{
  "clerkId": "user_123",
  "email": "test@example.com",
  "role": "CLIEN"  // ← Typo détectée immédiatement !
}

// Réponse : HTTP 422 Unprocessable Entity
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "role",
      "message": "Role must be either CLIENT or PRO"
    }
  ]
}
```

---

## 📁 Structure de la validation

```
apps/api/src/
├── adapters/in/http/
│   ├── validation/              ← 🎯 Validation HTTP (Zod)
│   │   ├── user.validation.ts
│   │   ├── booking.validation.ts
│   │   └── review.validation.ts
│   │
│   └── controllers/
│       └── UserController.ts    ← Utilise les schemas Zod
│
├── core/domain/
│   ├── entities/                ← 🎯 Validation métier (classes)
│   │   ├── User.ts              ← Méthodes de validation métier
│   │   └── Booking.ts
│   │
│   └── value-objects/           ← 🎯 Validation forte (immutables)
│       ├── Email.ts             ← Validation format email
│       └── Money.ts
```

---

## 💻 Implémentation : Validation HTTP (Zod)

### 1. Créer le schema de validation

```typescript
// adapters/in/http/validation/user.validation.ts
import { z } from 'zod';
import { UserRole } from '../../../../core/domain/entities/User';

export const createUserSchema = z.object({
  clerkId: z.string().min(1, 'ClerkId is required'),
  email: z.string().email('Invalid email format').nullable(),
  role: z.nativeEnum(UserRole, {
    message: 'Role must be either CLIENT or PRO',
  }),
  firstName: z.string().min(1).nullable().optional(),
  lastName: z.string().min(1).nullable().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

### 2. Utiliser dans le Controller

```typescript
// adapters/in/http/controllers/UserController.ts
import { ZodError } from 'zod';
import { createUserSchema } from '../validation/user.validation';

async createUser(req: Request, res: Response): Promise<void> {
  try {
    // ✅ VALIDATION : Parse et valide les données
    const validatedData = createUserSchema.parse(req.body);

    // Si on arrive ici, les données sont valides
    const user = await this.createUserUseCase.execute(validatedData);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    this.handleError(error, res);
  }
}
```

### 3. Gérer les erreurs Zod

```typescript
private handleError(error: unknown, res: Response): void {
  // Erreurs de validation Zod
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    res.status(422).json({
      success: false,
      error: 'Validation failed',
      details: formattedErrors,
    });
    return;
  }

  // Erreurs du domaine
  if (error instanceof DomainError) {
    res.status(400).json({ success: false, error: error.message });
    return;
  }

  // Autres erreurs...
}
```

---

## 🎓 Validation métier (Domain)

### Value Objects (validation forte)

```typescript
// core/domain/value-objects/Email.ts
export class Email {
  private readonly value: string;

  constructor(email: string) {
    // Validation métier spécifique
    if (!this.isValid(email)) {
      throw new ValidationError('Invalid email format');
    }
    this.value = email.toLowerCase();
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }
}
```

### Entités (règles métier)

```typescript
// core/domain/entities/User.ts
export class User {
  updateEmail(newEmail: string): void {
    // Règle métier : un email ne peut pas être vide
    if (!newEmail) {
      throw new ValidationError('Email cannot be empty');
    }

    // Règle métier : utiliser le Value Object pour valider
    this.props.email = new Email(newEmail);
    this.props.updatedAt = new Date();
  }

  changeRole(newRole: UserRole): void {
    // Règle métier : un CLIENT avec réservations actives ne peut pas devenir PRO
    if (this.props.role === UserRole.CLIENT && newRole === UserRole.PRO) {
      // Cette validation nécessiterait d'accéder au repository
      // Elle serait donc dans le service, pas ici
    }

    this.props.role = newRole;
    this.props.updatedAt = new Date();
  }
}
```

---

## 🚦 Codes de statut HTTP

| Code | Nom | Utilisation |
|------|-----|-------------|
| **422** | Unprocessable Entity | Validation Zod échouée (format, types, enum) |
| **400** | Bad Request | Erreur métier du domaine (ValidationError, DomainError) |
| **404** | Not Found | Ressource introuvable |
| **500** | Internal Server Error | Erreur serveur inattendue |

---

## ✅ Checklist : Quand valider quoi ?

### ✅ Validation HTTP (Zod) - TOUJOURS

- [ ] Format email valide
- [ ] Champs requis présents
- [ ] Types corrects (string, number, boolean)
- [ ] Enum values valides
- [ ] Longueur min/max des strings
- [ ] URL valide
- [ ] UUID valide
- [ ] Dates au bon format

### ✅ Validation Métier (Domain) - SI NÉCESSAIRE

- [ ] Email déjà utilisé (DB check)
- [ ] Règles business complexes
- [ ] État de l'entité cohérent
- [ ] Relations entre entités valides
- [ ] Permissions utilisateur
- [ ] Contraintes temporelles

---

## 🎯 FAQ

### Q: Frontend valide déjà, pourquoi valider backend ?
**R:** Le frontend peut être contourné (Postman, cURL, dev tools). Le backend est la **source de vérité**.

### Q: Zod dans le controller, pas dans un middleware ?
**R:** Possible aussi ! Mais dans le controller c'est :
- Plus explicite (on voit directement quel schema)
- Plus facile à tester
- Plus flexible (différents schemas selon l'action)

### Q: Pourquoi pas Joi au lieu de Zod ?
**R:** Zod offre :
- Meilleure intégration TypeScript
- Inférence de types automatique
- Plus moderne et maintenu
- Meilleur avec les enum TypeScript

### Q: Validation synchrone ou asynchrone ?
**R:**
- **Zod (HTTP)** : Synchrone (format, types)
- **Domain** : Peut être async si besoin DB (email unique, etc.)

---

## 📚 Exemples de schemas Zod courants

### Email nullable mais valide si fourni
```typescript
email: z.string().email().nullable()
```

### String optionnelle mais min 3 caractères si fournie
```typescript
firstName: z.string().min(3).optional()
```

### Enum avec message custom
```typescript
role: z.nativeEnum(UserRole, {
  message: 'Role must be CLIENT or PRO',
})
```

### Date dans le futur
```typescript
bookingDate: z.date().refine(
  (date) => date > new Date(),
  { message: 'Booking date must be in the future' }
)
```

### URL valide
```typescript
avatar: z.string().url('Must be a valid URL').nullable()
```

### UUID valide
```typescript
id: z.string().uuid('Must be a valid UUID')
```

### Transformation automatique
```typescript
price: z.string().transform((val) => parseFloat(val))
```

---

## 🚀 Résumé en une image

```
┌─────────────────────────────────────────┐
│   HTTP Request (peut être malicieux)    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  ✅ VALIDATION ZOD  │ ← Adapters (HTTP)
         │  (Format, Types)    │
         └──────────┬──────────┘
                    │ ✅ Données structurellement valides
                    ▼
         ┌─────────────────────┐
         │  Controller         │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  ✅ VALIDATION      │ ← Core (Domain)
         │  MÉTIER             │
         │  (Business Rules)   │
         └──────────┬──────────┘
                    │ ✅ Données métier valides
                    ▼
         ┌─────────────────────┐
         │  Repository → DB    │
         └─────────────────────┘
```

---

**🛡️ Principe d'or : Le backend DOIT toujours valider, même si le frontend le fait déjà !**
