import type { Metadata } from 'next';
import { ProOnboardingMain } from '@/components/features/pro-onboarding/pro-onboarding-main';

export const metadata: Metadata = {
  title: 'Inscription Professionnel | Booklin',
  description: 'Devenez professionnel sur Booklin et commencez à recevoir des réservations',
};

export default function OnboardingPage() {
  return <ProOnboardingMain />;
}
