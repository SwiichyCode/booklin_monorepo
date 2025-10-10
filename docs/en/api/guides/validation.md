# 🛡️ Validation Guide - Hexagonal Architecture

## 🎯 Principle: Multi-level Validation

In hexagonal architecture, validation happens at **TWO levels**:

```
HTTP Request
    ↓
1. HTTP VALIDATION (Zod) ← In the Controller (adapters/in)
    ↓
2. BUSINESS VALIDATION ← In Domain Entities (core/domain)
    ↓
Use Case → Repository → Database
```

---

## 📊 Two Types of Validation

### 1. **HTTP Validation (Controller - Adapter)**
- **Where**: `adapters/in/http/validation/`
- **Tool**: Zod
- **Role**: Validate **structure** and **format** of HTTP data
- **Examples**:
  - Valid email format
  - Required fields present
  - Correct types (string, number, etc.)
  - Valid enum values (CLIENT, PRO)
  - Valid URL

### 2. **Business Validation (Domain - Core)**
- **Where**: `core/domain/entities/` and `core/domain/value-objects/`
- **Tool**: TypeScript classes + business logic
- **Role**: Validate **business rules**
- **Examples**:
  - Email not already used (DB check)
  - User can change role based on state
  - A pro can have max X active services
  - A booking must be in the future

---

## 🔥 Example: Why Both Are Necessary?

### Invalid request: `role: "CLIEN"` (typo)

```typescript
// ❌ WITHOUT Zod validation
POST /api/users
{
  "clerkId": "user_123",
  "email": "test@example.com",
  "role": "CLIEN"  // ← Typo!
}

// Result: Data inserted in DB with invalid role!
// Error discovered later, corrupted data
```

```typescript
// ✅ WITH Zod validation
POST /api/users
{
  "clerkId": "user_123",
  "email": "test@example.com",
  "role": "CLIEN"  // ← Typo detected immediately!
}

// Response: HTTP 422 Unprocessable Entity
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

## 📁 Validation Structure

```
apps/api/src/
├── adapters/in/http/
│   ├── validation/              ← 🎯 HTTP Validation (Zod)
│   │   ├── user.validation.ts
│   │   ├── booking.validation.ts
│   │   └── review.validation.ts
│   │
│   └── controllers/
│       └── UserController.ts    ← Uses Zod schemas
│
├── core/domain/
│   ├── entities/                ← 🎯 Business Validation (classes)
│   │   ├── User.ts              ← Business validation methods
│   │   └── Booking.ts
│   │
│   └── value-objects/           ← 🎯 Strong Validation (immutables)
│       ├── Email.ts             ← Email format validation
│       └── Money.ts
```

---

## 💻 Implementation: HTTP Validation (Zod)

### 1. Create Validation Schema

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

### 2. Use in Controller

```typescript
// adapters/in/http/controllers/UserController.ts
import { ZodError } from 'zod';
import { createUserSchema } from '../validation/user.validation';

async createUser(req: Request, res: Response): Promise<void> {
  try {
    // ✅ VALIDATION: Parse and validate data
    const validatedData = createUserSchema.parse(req.body);

    // If we get here, data is valid
    const user = await this.createUserUseCase.execute(validatedData);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    this.handleError(error, res);
  }
}
```

### 3. Handle Zod Errors

```typescript
private handleError(error: unknown, res: Response): void {
  // Zod validation errors
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

  // Domain errors
  if (error instanceof DomainError) {
    res.status(400).json({ success: false, error: error.message });
    return;
  }

  // Other errors...
}
```

---

## 🎓 Business Validation (Domain)

### Value Objects (strong validation)

```typescript
// core/domain/value-objects/Email.ts
export class Email {
  private readonly value: string;

  constructor(email: string) {
    // Specific business validation
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

### Entities (business rules)

```typescript
// core/domain/entities/User.ts
export class User {
  updateEmail(newEmail: string): void {
    // Business rule: email cannot be empty
    if (!newEmail) {
      throw new ValidationError('Email cannot be empty');
    }

    // Business rule: use Value Object to validate
    this.props.email = new Email(newEmail);
    this.props.updatedAt = new Date();
  }

  changeRole(newRole: UserRole): void {
    // Business rule: CLIENT with active bookings cannot become PRO
    if (this.props.role === UserRole.CLIENT && newRole === UserRole.PRO) {
      // This validation would require repository access
      // So it would be in the service, not here
    }

    this.props.role = newRole;
    this.props.updatedAt = new Date();
  }
}
```

---

## 🚦 HTTP Status Codes

| Code | Name | Use Case |
|------|------|----------|
| **422** | Unprocessable Entity | Zod validation failed (format, types, enum) |
| **400** | Bad Request | Business domain error (ValidationError, DomainError) |
| **404** | Not Found | Resource not found |
| **500** | Internal Server Error | Unexpected server error |

---

## ✅ Checklist: When to Validate What?

### ✅ HTTP Validation (Zod) - ALWAYS

- [ ] Valid email format
- [ ] Required fields present
- [ ] Correct types (string, number, boolean)
- [ ] Valid enum values
- [ ] String min/max length
- [ ] Valid URL
- [ ] Valid UUID
- [ ] Dates in correct format

### ✅ Business Validation (Domain) - IF NEEDED

- [ ] Email already used (DB check)
- [ ] Complex business rules
- [ ] Consistent entity state
- [ ] Valid entity relationships
- [ ] User permissions
- [ ] Time constraints

---

## 🎯 FAQ

### Q: Frontend already validates, why validate backend?
**A:** Frontend can be bypassed (Postman, cURL, dev tools). Backend is the **source of truth**.

### Q: Zod in controller, not in middleware?
**A:** Possible too! But in the controller it's:
- More explicit (you see which schema directly)
- Easier to test
- More flexible (different schemas per action)

### Q: Why not Joi instead of Zod?
**A:** Zod offers:
- Better TypeScript integration
- Automatic type inference
- More modern and maintained
- Better with TypeScript enums

### Q: Synchronous or asynchronous validation?
**A:**
- **Zod (HTTP)**: Synchronous (format, types)
- **Domain**: Can be async if needs DB (unique email, etc.)

---

## 📚 Common Zod Schema Examples

### Nullable email but valid if provided
```typescript
email: z.string().email().nullable()
```

### Optional string but min 3 characters if provided
```typescript
firstName: z.string().min(3).optional()
```

### Enum with custom message
```typescript
role: z.nativeEnum(UserRole, {
  message: 'Role must be CLIENT or PRO',
})
```

### Date in the future
```typescript
bookingDate: z.date().refine(
  (date) => date > new Date(),
  { message: 'Booking date must be in the future' }
)
```

### Valid URL
```typescript
avatar: z.string().url('Must be a valid URL').nullable()
```

### Valid UUID
```typescript
id: z.string().uuid('Must be a valid UUID')
```

### Automatic transformation
```typescript
price: z.string().transform((val) => parseFloat(val))
```

---

## 🚀 Summary in One Diagram

```
┌─────────────────────────────────────────┐
│   HTTP Request (can be malicious)       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  ✅ ZOD VALIDATION  │ ← Adapters (HTTP)
         │  (Format, Types)    │
         └──────────┬──────────┘
                    │ ✅ Structurally valid data
                    ▼
         ┌─────────────────────┐
         │  Controller         │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  ✅ BUSINESS        │ ← Core (Domain)
         │  VALIDATION         │
         │  (Business Rules)   │
         └──────────┬──────────┘
                    │ ✅ Business-valid data
                    ▼
         ┌─────────────────────┐
         │  Repository → DB    │
         └─────────────────────┘
```

---

**🛡️ Golden Rule: Backend MUST always validate, even if frontend does too!**
