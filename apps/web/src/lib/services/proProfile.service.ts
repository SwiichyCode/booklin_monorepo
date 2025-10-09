// lib/api/services/proProfile.service.ts

import { apiClient } from '@/lib/api/client';
import type { ProProfileResponse, OnboardingStep, ProOnboardingFormData } from '@/lib/types/pro-onboarding.types';

export const proProfileService = {
  /**
   * Récupère le profil pro de l'utilisateur connecté
   */
  getMyProfile: async (): Promise<ProProfileResponse> => {
    const { data } = await apiClient.get('/pro-profiles/me');
    return data;
  },

  /**
   * Crée un nouveau profil professionnel
   */
  createProfile: async (profileData: Partial<ProOnboardingFormData>): Promise<ProProfileResponse> => {
    const { data } = await apiClient.post('/pro-profiles', profileData);
    return data;
  },

  /**
   * Met à jour une étape spécifique du profil
   */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProfileStep: async (step: OnboardingStep, stepData: any): Promise<ProProfileResponse> => {
    const { data } = await apiClient.patch('/pro-profiles/me/onboarding', {
      step,
      data: stepData,
    });
    return data;
  },

  /**
   * Met à jour le profil complet
   */
  updateProfile: async (profileData: Partial<ProOnboardingFormData>): Promise<ProProfileResponse> => {
    const { data } = await apiClient.patch('/pro-profiles/me', profileData);
    return data;
  },

  /**
   * Soumet le profil pour validation
   */
  submitForValidation: async (): Promise<ProProfileResponse> => {
    const { data } = await apiClient.post('/pro-profiles/me/submit');
    return data;
  },

  /**
   * Upload une photo
   */
  uploadPhoto: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('photo', file);

    const { data } = await apiClient.post('/pro-profiles/me/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  /**
   * Supprime une photo
   */
  deletePhoto: async (photoUrl: string): Promise<void> => {
    await apiClient.delete('/pro-profiles/me/photos', {
      data: { url: photoUrl },
    });
  },

  /**
   * Géocode une adresse (transforme adresse en lat/lng)
   */
  geocodeAddress: async (address: string, postalCode: string, city: string) => {
    const { data } = await apiClient.get('/pro-profiles/geocode', {
      params: { address, postalCode, city },
    });
    return data;
  },
};
