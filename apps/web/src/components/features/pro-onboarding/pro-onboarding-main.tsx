'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useProOnboardingStore } from '@/lib/stores/useProOnBoardingStore';
import { ONBOARDING_STEPS, OnboardingStep } from '@/lib/types/pro-onboarding.types';
import { EnterpriseInfoStep } from './steps/enterprise-info-step';
import { useProProfile } from '@/lib/hooks/useProProfile';

export function ProOnboardingMain() {
  const { isLoaded: isClerkLoaded, user } = useUser();
  const { currentStep, nextStep, previousStep, setCurrentStep, completedSteps, canGoToStep, hydrateFromReactQuery } =
    useProOnboardingStore();

  const { data: profileData, isLoading: isProfileLoading, isError } = useProProfile();

  useEffect(() => {
    if (profileData) {
      hydrateFromReactQuery(profileData);
    }
  }, [profileData, hydrateFromReactQuery]);

  const currentStepConfig = ONBOARDING_STEPS.find(s => s.key === currentStep)!;
  const currentStepIndex = ONBOARDING_STEPS.findIndex(s => s.key === currentStep);

  const goToStep = (step: OnboardingStep) => {
    if (canGoToStep(step)) {
      setCurrentStep(step);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case OnboardingStep.ENTERPRISE_INFO:
        return <EnterpriseInfoStep onNext={nextStep} onPrevious={previousStep} />;

      case OnboardingStep.PROFESSIONAL_INFO:
      // return <ProfessionalInfoStep onNext={nextStep} onPrevious={previousStep} />;

      case OnboardingStep.LOCATION:
      // return <LocationStep onNext={nextStep} onPrevious={previousStep} />;

      case OnboardingStep.MEDIA:
      // return <MediaStep onNext={nextStep} onPrevious={previousStep} />;

      case OnboardingStep.COMPLETED:
      // return <CompletedStep onPrevious={previousStep} />;

      default:
        return null;
    }
  };

  // 🔥 Afficher un loader pendant le chargement de Clerk OU du profil
  if (!isClerkLoaded || isProfileLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-lg font-semibold">
            {!isClerkLoaded ? 'Authentification en cours...' : 'Chargement de votre profil...'}
          </p>
        </div>
      </div>
    );
  }

  // 🔥 Si pas d'utilisateur connecté, rediriger ou afficher un message
  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-lg font-semibold">Vous devez être connecté pour accéder à cette page</p>
        </div>
      </div>
    );
  }

  // 🔥 Afficher une erreur si échec (uniquement après que Clerk soit chargé)
  if (isError) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Erreur lors du chargement du profil</p>
          <p className="text-sm mt-2">Veuillez réessayer plus tard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold">
          {currentStepIndex + 1}/{ONBOARDING_STEPS.length}
        </p>

        {renderStepContent()}
      </div>
    </div>
  );
}
