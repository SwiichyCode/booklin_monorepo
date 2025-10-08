import type { User, UserRole } from '@prisma/client';

export type { User, UserRole };

export interface CreateUserDTO {
  clerkId: string;
  email: string | null;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
}

export interface UpdateUserDTO {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: UserRole;
  phone?: string | null;
  avatar?: string | null;
}

export interface UserFilter {
  id?: string;
  clerkId?: string;
  email?: string;
  role?: UserRole;
}
