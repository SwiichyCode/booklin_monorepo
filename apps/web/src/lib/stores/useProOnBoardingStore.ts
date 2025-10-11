// lib/stores/useProOnboardingStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OnboardingStep, ProOnboardingFormData, ProProfileResponse } from '@/lib/types/pro-onboarding.types';

interface ProOnboardingState {
  // État du formulaire
  currentStep: OnboardingStep;
  formData: Partial<ProOnboardingFormData>;
  completedSteps: Set<OnboardingStep>;

  // Actions
  setCurrentStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  previousStep: () => void;

  hydrateFromReactQuery: (profileData: ProProfileResponse) => void;

  updateFormData: <K extends keyof ProOnboardingFormData>(key: K, data: ProOnboardingFormData[K]) => void;

  markStepComplete: (step: OnboardingStep) => void;

  resetOnboarding: () => void;

  // Helpers
  canGoToStep: (step: OnboardingStep) => boolean;
  getProgress: () => number;
}

const STEP_ORDER = [
  OnboardingStep.ENTERPRISE_INFO,
  OnboardingStep.PROFESSIONAL_INFO,
  OnboardingStep.LOCATION,
  OnboardingStep.MEDIA,
  OnboardingStep.COMPLETED,
];

export const useProOnboardingStore = create<ProOnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: OnboardingStep.ENTERPRISE_INFO,
      formData: {},
      completedSteps: new Set(),

      hydrateFromReactQuery: (profileData: ProProfileResponse) => {
        // Mapper les données API vers le format du store
        set({
          formData: {
            enterpriseInfo: {
              businessName: profileData.businessName || '',
              profession: profileData.profession || '',
              experience: profileData.experience || 0,
              certifications: profileData.certifications || [],
              bio: profileData.bio || '',
            },
            professionalInfo: {
              siret: profileData.siret || '',
              corporateName: profileData.corporateName || '',
              legalForm: profileData.legalForm,
              legalStatus: profileData.legalStatus,
            },
            location: {
              address: profileData.address || '',
              postalCode: profileData.postalCode || '',
              city: profileData.city || '',
              latitude: profileData.latitude,
              longitude: profileData.longitude,
              radius: profileData.radius || 10,
            },
            media: {
              photos: profileData.photos || [],
            },
          },
          currentStep: profileData.onboardingStep || OnboardingStep.ENTERPRISE_INFO,
          completedSteps: new Set(profileData.completedSteps || []),
        });
      },

      setCurrentStep: step => {
        const canGo = get().canGoToStep(step);
        if (canGo) {
          set({ currentStep: step });
        }
      },

      nextStep: () => {
        const { currentStep } = get();
        const currentIndex = STEP_ORDER.indexOf(currentStep);

        if (currentIndex < STEP_ORDER.length - 1) {
          set({ currentStep: STEP_ORDER[currentIndex + 1] });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        const currentIndex = STEP_ORDER.indexOf(currentStep);

        if (currentIndex > 0) {
          set({ currentStep: STEP_ORDER[currentIndex - 1] });
        }
      },

      updateFormData: (key, data) => {
        set(state => ({
          formData: {
            ...state.formData,
            [key]: data,
          },
        }));
      },

      markStepComplete: step => {
        set(state => {
          const newCompletedSteps = new Set(state.completedSteps);
          newCompletedSteps.add(step);
          return { completedSteps: newCompletedSteps };
        });
      },

      resetOnboarding: () => {
        set({
          currentStep: OnboardingStep.ENTERPRISE_INFO,
          formData: {},
          completedSteps: new Set(),
        });
      },

      canGoToStep: targetStep => {
        const { completedSteps, currentStep } = get();
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        const targetIndex = STEP_ORDER.indexOf(targetStep);

        // On peut toujours aller en arrière
        if (targetIndex <= currentIndex) return true;

        // Pour aller en avant, toutes les étapes précédentes doivent être complètes
        for (let i = 0; i < targetIndex; i++) {
          if (!completedSteps.has(STEP_ORDER[i])) {
            return false;
          }
        }

        return true;
      },

      getProgress: () => {
        const { completedSteps } = get();
        // On exclut COMPLETED du calcul
        const totalSteps = STEP_ORDER.length - 1;
        return (completedSteps.size / totalSteps) * 100;
      },
    }),
    {
      name: 'pro-onboarding-storage',
      partialize: state => ({
        formData: state.formData,
        completedSteps: Array.from(state.completedSteps), // Set -> Array pour serialization
      }),
      onRehydrateStorage: () => state => {
        if (state && Array.isArray(state.completedSteps)) {
          // Array -> Set lors de la réhydratation
          state.completedSteps = new Set(state.completedSteps);
        }
      },
    },
  ),
);
