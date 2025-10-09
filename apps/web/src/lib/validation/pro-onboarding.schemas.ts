// lib/validation/pro-onboarding.schemas.ts

import { z } from 'zod';

// Étape 1 : Informations Entreprise
export const enterpriseInfoSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),

  profession: z.string().min(1, 'Veuillez sélectionner une profession'),

  experience: z
    .number()
    .int()
    .min(0, "L'expérience ne peut pas être négative")
    .max(50, "L'expérience semble trop élevée")
    .optional(),

  certifications: z.array(z.string()).optional(),

  bio: z
    .string()
    .min(50, 'La bio doit contenir au moins 50 caractères')
    .max(1000, 'La bio ne peut pas dépasser 1000 caractères')
    .optional(),
});

// Étape 2 : Informations Professionnelles
export const professionalInfoSchema = z.object({
  siret: z
    .string()
    .regex(/^\d{14}$/, 'Le SIRET doit contenir exactement 14 chiffres')
    .min(14, 'Le SIRET doit contenir 14 chiffres')
    .max(14, 'Le SIRET doit contenir 14 chiffres'),

  corporateName: z
    .string()
    .min(2, 'La raison sociale doit contenir au moins 2 caractères')
    .max(200, 'La raison sociale ne peut pas dépasser 200 caractères'),

  legalForm: z.enum(['Auto-entrepreneur', 'EURL', 'SARL', 'SAS', 'SASU', 'Autre']).optional(),

  legalStatus: z.string().optional(),
});

// Étape 3 : Localisation
export const locationSchema = z.object({
  address: z
    .string()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(200, "L'adresse ne peut pas dépasser 200 caractères"),

  postalCode: z.string().regex(/^\d{5}$/, 'Le code postal doit contenir 5 chiffres'),

  city: z
    .string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(100, 'La ville ne peut pas dépasser 100 caractères'),

  latitude: z.number().min(-90).max(90).optional(),

  longitude: z.number().min(-180).max(180).optional(),

  radius: z.number().int().min(1, 'Le rayon minimum est de 1 km').max(100, 'Le rayon maximum est de 100 km').default(5),
});

// Étape 4 : Médias
export const mediaSchema = z.object({
  photos: z
    .array(z.string().url('URL invalide'))
    .min(1, 'Veuillez ajouter au moins 1 photo')
    .max(10, 'Maximum 10 photos autorisées'),
});

// Schéma complet combiné
export const completeOnboardingSchema = z.object({
  enterpriseInfo: enterpriseInfoSchema,
  professionalInfo: professionalInfoSchema,
  location: locationSchema,
  media: mediaSchema,
});

export type EnterpriseInfoFormData = z.infer<typeof enterpriseInfoSchema>;
export type ProfessionalInfoFormData = z.infer<typeof professionalInfoSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
export type MediaFormData = z.infer<typeof mediaSchema>;
export type CompleteOnboardingFormData = z.infer<typeof completeOnboardingSchema>;
