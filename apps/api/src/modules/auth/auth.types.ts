// apps/api/src/modules/auth/auth.types.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().optional(),
});
export type RegisterDTO = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginDTO = z.infer<typeof loginSchema>;

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  passwordHash: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
