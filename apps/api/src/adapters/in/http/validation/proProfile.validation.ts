import { z } from 'zod';
import { OnboardingStep, ValidationStatus } from '@/core/domain/entities/ProProfile';

// Schema for creating a pro profile
export const createProProfileSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  businessName: z.string().min(1).max(255).nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
  profession: z.string().min(1).max(100).nullable().optional(),
  siret: z
    .string()
    .regex(/^\d{14}$/, 'SIRET must be 14 digits')
    .nullable()
    .optional(),
  corporateName: z.string().min(1).max(255).nullable().optional(),
  legalForm: z.string().min(1).max(100).nullable().optional(),
  legalStatus: z.string().min(1).max(100).nullable().optional(),
  experience: z.number().int().min(0).max(100).nullable().optional(),
  certifications: z.array(z.string()).optional(),
  address: z.string().min(1).max(500).nullable().optional(),
  postalCode: z.string().min(1).max(20).nullable().optional(),
  city: z.string().min(1).max(100).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  radius: z.number().int().min(0).max(100).nullable().optional(),
  photos: z.array(z.string().url()).optional(),
});

// Schema for updating a pro profile
export const updateProProfileSchema = z.object({
  businessName: z.string().min(1).max(255).nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
  profession: z.string().min(1).max(100).nullable().optional(),
  siret: z
    .string()
    .regex(/^\d{14}$/, 'SIRET must be 14 digits')
    .nullable()
    .optional(),
  corporateName: z.string().min(1).max(255).nullable().optional(),
  legalForm: z.string().min(1).max(100).nullable().optional(),
  legalStatus: z.string().min(1).max(100).nullable().optional(),
  experience: z.number().int().min(0).max(100).nullable().optional(),
  certifications: z.array(z.string()).optional(),
  address: z.string().min(1).max(500).nullable().optional(),
  postalCode: z.string().min(1).max(20).nullable().optional(),
  city: z.string().min(1).max(100).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  radius: z.number().int().min(0).max(100).nullable().optional(),
  photos: z.array(z.string().url()).optional(),
  onboardingStep: z
    .nativeEnum(OnboardingStep, {
      message: 'Invalid onboarding step',
    })
    .optional(),
});

// Schema for rejecting a pro profile
export const rejectProProfileSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required').max(500),
});

// Schema for activating premium
export const activatePremiumSchema = z.object({
  durationInDays: z.number().int().min(1).max(3650), // Max 10 years
});

// Schema for renewing premium
export const renewPremiumSchema = z.object({
  additionalDays: z.number().int().min(1).max(3650),
});

// Schema for query filters
export const proProfileFiltersSchema = z.object({
  profession: z.string().optional(),
  city: z.string().optional(),
  isPremium: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  validationStatus: z
    .nativeEnum(ValidationStatus, {
      message: 'Invalid validation status',
    })
    .optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
});

// Export TypeScript types
export type CreateProProfileInput = z.infer<typeof createProProfileSchema>;
export type UpdateProProfileInput = z.infer<typeof updateProProfileSchema>;
export type RejectProProfileInput = z.infer<typeof rejectProProfileSchema>;
export type ActivatePremiumInput = z.infer<typeof activatePremiumSchema>;
export type RenewPremiumInput = z.infer<typeof renewPremiumSchema>;
export type ProProfileFiltersInput = z.infer<typeof proProfileFiltersSchema>;
