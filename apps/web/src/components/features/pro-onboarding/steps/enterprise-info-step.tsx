'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useProOnboardingStore } from '@/lib/stores/useProOnBoardingStore';
import { EnterpriseInfoFormData, enterpriseInfoSchema } from '@/lib/validation/pro-onboarding.schemas';

import { Form } from '@/components/ui/form';
import { InputForm } from '@/components/shared/input-form';
import { SelectForm } from '@/components/shared/select-form';
import { TextAreaForm } from '@/components/shared/textarea-form';
import { Button } from '@/components/ui/button';
import { OnboardingStep } from '@/lib/types/pro-onboarding.types';

interface EnterpriseInfoStepProps {
  onNext: () => void;
  onPrevious?: () => void;
}

export function EnterpriseInfoStep({ onNext, onPrevious }: EnterpriseInfoStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formData, updateFormData, markStepComplete } = useProOnboardingStore();

  const form = useForm<EnterpriseInfoFormData>({
    resolver: zodResolver(enterpriseInfoSchema),
    defaultValues: {
      businessName: formData.enterpriseInfo?.businessName ?? '',
      profession: formData.enterpriseInfo?.profession ?? '',
      experience: formData.enterpriseInfo?.experience ?? 0,
      certifications: formData.enterpriseInfo?.certifications ?? [],
      bio: formData.enterpriseInfo?.bio ?? '',
    },
  });

  const onSubmit = async (data: EnterpriseInfoFormData) => {
    setIsSubmitting(true);

    console.log('onSubmit', data);

    // Save to store
    updateFormData('enterpriseInfo', data);

    // Call API Service

    markStepComplete(OnboardingStep.ENTERPRISE_INFO);

    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
        <InputForm name="businessName" label="Nom de l'entreprise" control={form.control} />
        <SelectForm
          name="profession"
          label="Profession"
          control={form.control}
          placeholder="Veuillez sélectionner une profession"
          items={[
            'Coiffeur',
            'Barbier',
            'Masseur',
            'Esthéticienne',
            'Manucure',
            'Coach Sportif',
            'Professeur de Yoga',
            'Autre',
          ]}
        />
        <InputForm name="experience" label="Expérience" control={form.control} />
        <InputForm name="certifications" label="Certifications" control={form.control} />
        <TextAreaForm name="bio" label="Biographie" control={form.control} />

        <div className="flex justify-between">
          <Button type="button" onClick={onPrevious} disabled>
            Précédent
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'En cours...' : 'Suivant'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
