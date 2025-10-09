/**
 * User Validation Schemas
 *
 * Schemas Zod pour valider les données entrantes des requêtes HTTP.
 * Ces validations sont la première ligne de défense contre les données invalides.
 */

import { z } from 'zod';
import { UserRole } from '../../../../core/domain/entities/User';

/**
 * Schema pour la création d'un utilisateur
 */
export const createUserSchema = z.object({
  clerkId: z.string().min(1, 'ClerkId is required'),
  email: z.string().email('Invalid email format').nullable(),
  role: z.nativeEnum(UserRole, {
    message: 'Role must be either CLIENT or PRO',
  }),
  firstName: z.string().min(1).nullable().optional(),
  lastName: z.string().min(1).nullable().optional(),
});

/**
 * Schema pour la mise à jour d'un utilisateur
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
 * Schema pour les paramètres ClerkId
 */
export const clerkIdParamSchema = z.object({
  clerkId: z.string().min(1, 'ClerkId is required'),
});

/**
 * Schema pour les paramètres ID
 */
export const idParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
});

/**
 * Schema pour les paramètres Email
 */
export const emailParamSchema = z.object({
  email: z.string().email('Invalid email format'),
});

/**
 * Schema pour les query params de filtrage
 */
export const getUsersQuerySchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  email: z.string().email().optional(),
});

// Types inférés depuis les schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ClerkIdParam = z.infer<typeof clerkIdParamSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type EmailParam = z.infer<typeof emailParamSchema>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
