export enum OnboardingStep {
  ENTERPRISE_INFO = 'ENTERPRISE_INFO',
  PROFESSIONAL_INFO = 'PROFESSIONAL_INFO',
  LOCATION = 'LOCATION',
  MEDIA = 'MEDIA',
  COMPLETED = 'COMPLETED',
}

export enum ValidationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Types pour chaque étape du formulaire
export interface EnterpriseInfoData {
  businessName: string;
  profession: string;
  experience?: number;
  certifications?: string[];
  bio?: string;
}

export interface ProfessionalInfoData {
  siret: string;
  corporateName: string;
  legalForm?: string;
  legalStatus?: string;
}

export interface LocationData {
  address: string;
  postalCode: string;
  city: string;
  latitude?: number;
  longitude?: number;
  radius: number; // en km
}

export interface MediaData {
  photos: string[]; // URLs Cloudinary
}

// Type complet du formulaire
export interface ProOnboardingFormData {
  enterpriseInfo: EnterpriseInfoData;
  professionalInfo: ProfessionalInfoData;
  location: LocationData;
  media: MediaData;
}

// Type pour la réponse API
export interface ProProfileResponse {
  id: string;
  userId: string;
  onboardingStep: OnboardingStep;
  onboardingProgress: number;
  onboardingComplete: boolean;
  validationStatus: ValidationStatus;
  isActive: boolean;
  isPremium: boolean;
  // ... autres champs
}

// Configuration des étapes
export const ONBOARDING_STEPS = [
  {
    key: OnboardingStep.ENTERPRISE_INFO,
    label: 'Informations Entreprise',
    description: 'Présentez votre activité',
    progress: 20,
  },
  {
    key: OnboardingStep.PROFESSIONAL_INFO,
    label: 'Informations Légales',
    description: 'Vos informations administratives',
    progress: 40,
  },
  {
    key: OnboardingStep.LOCATION,
    label: "Zone d'intervention",
    description: 'Où proposez-vous vos services ?',
    progress: 60,
  },
  {
    key: OnboardingStep.MEDIA,
    label: 'Photos',
    description: 'Valorisez votre travail',
    progress: 80,
  },
  {
    key: OnboardingStep.COMPLETED,
    label: 'Validation',
    description: 'Vérification de votre profil',
    progress: 100,
  },
] as const;

// Liste des professions disponibles
export const PROFESSIONS = [
  'Coiffeur',
  'Barbier',
  'Masseur',
  'Esthéticienne',
  'Manucure',
  'Coach Sportif',
  'Professeur de Yoga',
  'Autre',
] as const;

export type Profession = (typeof PROFESSIONS)[number];
