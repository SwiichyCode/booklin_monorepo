/**
 * Endpoints pour la gestion des profils professionnels
 */

import { createEndpoint } from '../lib/types';

const BASE_PATH = '/pro-profiles';

export const proProfileEndpoints = {
  // ========================================
  // CRUD Endpoints
  // ========================================

  /**
   * @route   POST /api/pro-profiles
   * @desc    Créer un nouveau profil professionnel
   * @access  Private
   */
  create: createEndpoint('POST', BASE_PATH, {
    description: 'Créer un nouveau profil professionnel',
    access: 'private',
  }),

  /**
   * @route   PATCH /api/pro-profiles/:id
   * @desc    Mettre à jour un profil professionnel
   * @access  Private
   */
  update: createEndpoint<{ id: string }>('PATCH', `${BASE_PATH}/:id`, {
    description: 'Mettre à jour un profil professionnel',
    access: 'private',
  }),

  /**
   * @route   DELETE /api/pro-profiles/:id
   * @desc    Supprimer un profil professionnel
   * @access  Private
   */
  delete: createEndpoint<{ id: string }>('DELETE', `${BASE_PATH}/:id`, {
    description: 'Supprimer un profil professionnel',
    access: 'private',
  }),

  /**
   * @route   GET /api/pro-profiles/:id
   * @desc    Récupérer un profil professionnel par ID
   * @access  Public
   */
  getById: createEndpoint<{ id: string }>('GET', `${BASE_PATH}/:id`, {
    description: 'Récupérer un profil professionnel par ID',
    access: 'public',
  }),

  /**
   * @route   GET /api/pro-profiles/user/:userId
   * @desc    Récupérer un profil professionnel par user ID
   * @access  Public
   */
  getByUserId: createEndpoint<{ userId: string }>('GET', `${BASE_PATH}/user/:userId`, {
    description: 'Récupérer un profil professionnel par user ID',
    access: 'public',
  }),

  /**
   * @route   GET /api/pro-profiles
   * @desc    Récupérer tous les profils professionnels avec filtres
   * @access  Public
   * @query   profession, city, isPremium, validationStatus, isActive
   */
  getAll: createEndpoint('GET', BASE_PATH, {
    description: 'Récupérer tous les profils professionnels avec filtres',
    access: 'public',
  }),

  // ========================================
  // Approval Endpoints
  // ========================================

  /**
   * @route   POST /api/pro-profiles/:id/approve
   * @desc    Approuver un profil professionnel
   * @access  Admin
   */
  approve: createEndpoint<{ id: string }>('POST', `${BASE_PATH}/:id/approve`, {
    description: 'Approuver un profil professionnel',
    access: 'admin',
  }),

  /**
   * @route   POST /api/pro-profiles/:id/reject
   * @desc    Rejeter un profil professionnel
   * @access  Admin
   */
  reject: createEndpoint<{ id: string }>('POST', `${BASE_PATH}/:id/reject`, {
    description: 'Rejeter un profil professionnel',
    access: 'admin',
  }),

  // ========================================
  // Premium Management Endpoints
  // ========================================

  /**
   * @route   POST /api/pro-profiles/:id/premium/activate
   * @desc    Activer l'abonnement premium
   * @access  Private
   */
  activatePremium: createEndpoint<{ id: string }>('POST', `${BASE_PATH}/:id/premium/activate`, {
    description: "Activer l'abonnement premium",
    access: 'private',
  }),

  /**
   * @route   POST /api/pro-profiles/:id/premium/renew
   * @desc    Renouveler l'abonnement premium
   * @access  Private
   */
  renewPremium: createEndpoint<{ id: string }>('POST', `${BASE_PATH}/:id/premium/renew`, {
    description: "Renouveler l'abonnement premium",
    access: 'private',
  }),

  /**
   * @route   POST /api/pro-profiles/:id/premium/deactivate
   * @desc    Désactiver l'abonnement premium
   * @access  Private
   */
  deactivatePremium: createEndpoint<{ id: string }>('POST', `${BASE_PATH}/:id/premium/deactivate`, {
    description: "Désactiver l'abonnement premium",
    access: 'private',
  }),
} as const;
