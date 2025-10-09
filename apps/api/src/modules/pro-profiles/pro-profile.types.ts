import { OnboardingStep, User, ValidationStatus } from '@prisma/client';

import { z } from 'zod';

export const CreateProProfileSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  businessName: z.string(),
  bio: z.string().optional(),
  profession: z.string().optional(),
  experience: z.number().min(0).optional(),
  certifications: z.array(z.string()).optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().min(1).max(100).optional(),
  siret: z
    .string()
    .regex(/^\d{14}$/, 'SIRET must be 14 digits')
    .optional(),
  corporateName: z.string().optional(),
  legalForm: z.string().optional(),
  legalStatus: z.string().optional(),
  onboardingStep: z.nativeEnum(OnboardingStep).optional(),
  onboardingProgress: z.number().min(0).max(100).optional(),
  onboardingComplete: z.boolean().optional(),
  validationStatus: z.nativeEnum(ValidationStatus).optional(),
  isActive: z.boolean().optional(),
});

export type CreateProProfileDTO = z.infer<typeof CreateProProfileSchema>;

export const UpdateProProfileSchema = z.object({
  businessName: z.string().optional(),
  bio: z.string().optional(),
  profession: z.string().optional(),
  experience: z.number().min(0).optional(),
  certifications: z.array(z.string()).optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().min(1).max(100).optional(),
  siret: z
    .string()
    .regex(/^\d{14}$/, 'SIRET must be 14 digits')
    .optional(),
  corporateName: z.string().optional(),
  legalForm: z.string().optional(),
  legalStatus: z.string().optional(),
  onboardingStep: z.nativeEnum(OnboardingStep).optional(),
  onboardingProgress: z.number().min(0).max(100).optional(),
  onboardingComplete: z.boolean().optional(),
  validationStatus: z.nativeEnum(ValidationStatus).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateProProfileDTO = z.infer<typeof UpdateProProfileSchema>;

export interface ProProfileFilter {
  id?: string;
  userId?: string;
  user?: User;
  businessName?: string;
  bio?: string;
  profession?: string;
  experience?: number;
  certifications?: string[];
  address?: string;
  postalCode?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  siret?: string;
  corporateName?: string;
  legalForm?: string;
  legalStatus?: string;
  onboardingStep?: OnboardingStep;
  onboardingProgress?: number;
  onboardingComplete?: boolean;
  validationStatus?: ValidationStatus;
  isActive?: boolean;
}
