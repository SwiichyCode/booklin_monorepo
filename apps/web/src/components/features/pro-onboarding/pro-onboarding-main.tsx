'use client';

import { Button } from '@/components/ui/button';
import { useProOnboardingStore } from '@/lib/stores/useProOnBoardingStore';
import { ONBOARDING_STEPS, OnboardingStep } from '@/lib/types/pro-onboarding.types';
import { EnterpriseInfoStep } from './steps/enterprise-info-step';

export function ProOnboardingMain() {
  const { currentStep, nextStep, previousStep, setCurrentStep, completedSteps, canGoToStep } = useProOnboardingStore();

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
