/**
 * User Validation Schemas
 *
 * Zod schemas to validate incoming HTTP request data.
 * These validations are the first line of defense against invalid data.
 */

import { z } from 'zod';
import { UserRole } from '@/core/domain/entities/User';

/**
 * Schema for user creation
 */
export const createUserSchema = z.object({
  id: z.string().min(1, 'Id is required'),
  email: z.string().email('Invalid email format').nullable(),
  role: z.nativeEnum(UserRole, {
    message: 'Role must be either CLIENT or PRO',
  }),
  firstName: z.string().min(1).nullable().optional(),
  lastName: z.string().min(1).nullable().optional(),
});

/**
 * Schema for user update
 */
export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').nullable().optional(),
  firstName: z.string().min(1).nullable().optional(),
  lastName: z.string().min(1).nullable().optional(),
  phone: z.string().min(1).nullable().optional(),
  avatar: z.string().url('Avatar must be a valid URL').nullable().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

/**
 * Schema for ClerkId parameters
 */
export const clerkIdParamSchema = z.object({
  clerkId: z.string().min(1, 'ClerkId is required'),
});

/**
 * Schema for ID parameters
 */
export const idParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
});

/**
 * Schema for Email parameters
 */
export const emailParamSchema = z.object({
  email: z.string().email('Invalid email format'),
});

/**
 * Schema for filtering query params
 */
export const getUsersQuerySchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  email: z.string().email().optional(),
});

// Types inferred from schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ClerkIdParam = z.infer<typeof clerkIdParamSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type EmailParam = z.infer<typeof emailParamSchema>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
