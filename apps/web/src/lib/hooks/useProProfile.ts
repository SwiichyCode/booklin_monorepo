// lib/hooks/useProProfile.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proProfileService } from '@/lib/services/proProfile.service';
import { toast } from 'react-hot-toast';
import type { OnboardingStep, ProOnboardingFormData } from '@/lib/types/pro-onboarding.types';

/**
 * Hook pour récupérer le profil pro de l'utilisateur
 */
export function useProProfile() {
  return useQuery({
    queryKey: ['proProfile', 'me'],
    queryFn: () => proProfileService.getMyProfile(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook pour créer un profil pro
 */
export function useCreateProProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProOnboardingFormData>) => proProfileService.createProfile(data),

    onSuccess: data => {
      queryClient.setQueryData(['proProfile', 'me'], data);
      toast.success('Profil créé avec succès !');
    },

    onError: error => {
      const message = error.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
}

/**
 * Hook pour mettre à jour une étape du profil
 */
export function useUpdateProProfileStep() {
  const queryClient = useQueryClient();

  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ step, data }: { step: OnboardingStep; data: any }) =>
      proProfileService.updateProfileStep(step, data),

    onSuccess: data => {
      queryClient.setQueryData(['proProfile', 'me'], data);
    },

    onError: error => {
      const message = error.message || 'Erreur lors de la mise à jour';
      toast.error(message);
    },
  });
}

/**
 * Hook pour mettre à jour le profil complet
 */
export function useUpdateProProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProOnboardingFormData>) => proProfileService.updateProfile(data),

    onSuccess: data => {
      queryClient.setQueryData(['proProfile', 'me'], data);
      toast.success('Profil mis à jour !');
    },

    onError: error => {
      const message = error.message || 'Erreur lors de la mise à jour';
      toast.error(message);
    },
  });
}

/**
 * Hook pour soumettre le profil pour validation
 */
export function useSubmitProProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => proProfileService.submitForValidation(),

    onSuccess: data => {
      queryClient.setQueryData(['proProfile', 'me'], data);
      toast.success('Profil soumis avec succès ! Vous recevrez une réponse sous 24-48h.');
    },

    onError: error => {
      const message = error.message || 'Erreur lors de la soumission';
      toast.error(message);
    },
  });
}

/**
 * Hook pour uploader une photo
 */
export function useUploadProPhoto() {
  return useMutation({
    mutationFn: (file: File) => proProfileService.uploadPhoto(file),

    onError: error => {
      const message = error.message || "Erreur lors de l'upload";
      toast.error(message);
    },
  });
}

/**
 * Hook pour supprimer une photo
 */
export function useDeleteProPhoto() {
  return useMutation({
    mutationFn: (photoUrl: string) => proProfileService.deletePhoto(photoUrl),

    onSuccess: () => {
      toast.success('Photo supprimée');
    },

    onError: error => {
      const message = error.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
}
