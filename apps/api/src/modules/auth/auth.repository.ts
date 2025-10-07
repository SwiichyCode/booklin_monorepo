// apps/api/src/modules/auth/auth.repository.ts
export interface AuthRepository {
  findByEmail(email: string): Promise<import('./auth.types').AuthUser | null>;
  findById(id: string): Promise<import('./auth.types').AuthUser | null>;
  create(
    user: Pick<import('./auth.types').AuthUser, 'email' | 'passwordHash' | 'role'>,
  ): Promise<import('./auth.types').AuthUser>;
}

/**
 * Implémentation placeholder; remplace-la par Prisma/Drizzle.
 */
export class InMemoryAuthRepository implements AuthRepository {
  private users = new Map<string, import('./auth.types').AuthUser>();

  async findByEmail(email: string) {
    for (const u of this.users.values()) if (u.email === email) return u;
    return null;
  }
  async findById(id: string) {
    return this.users.get(id) ?? null;
  }
  async create(input: Pick<import('./auth.types').AuthUser, 'email' | 'passwordHash' | 'role'>) {
    const id = crypto.randomUUID();
    const user = { id, ...input } as import('./auth.types').AuthUser;
    this.users.set(id, user);
    return user;
  }
}
