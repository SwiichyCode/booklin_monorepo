/**
 * Endpoints pour la gestion des utilisateurs
 */

import { createEndpoint } from '../lib/types';

export const BASE_PATH = '/users';

export const userEndpoints = {
  /**
   * @route   POST /api/users
   * @desc    Créer un nouvel utilisateur
   * @access  Public
   */
  create: createEndpoint('POST', BASE_PATH, {
    description: 'Créer un nouvel utilisateur',
    access: 'public',
  }),

  /**
   * @route   PATCH /api/users/:clerkId
   * @desc    Mettre à jour un utilisateur
   * @access  Private
   */
  update: createEndpoint<{ clerkId: string }>('PATCH', `${BASE_PATH}/:clerkId`, {
    description: 'Mettre à jour un utilisateur',
    access: 'private',
  }),

  /**
   * @route   DELETE /api/users/:clerkId
   * @desc    Supprimer un utilisateur
   * @access  Private
   */
  delete: createEndpoint<{ clerkId: string }>('DELETE', `${BASE_PATH}/:clerkId`, {
    description: 'Supprimer un utilisateur',
    access: 'private',
  }),

  /**
   * @route   GET /api/users/clerk/:clerkId
   * @desc    Récupérer un utilisateur par Clerk ID
   * @access  Public
   */
  getByClerkId: createEndpoint<{ clerkId: string }>('GET', `${BASE_PATH}/clerk/:clerkId`, {
    description: 'Récupérer un utilisateur par Clerk ID',
    access: 'public',
  }),

  /**
   * @route   GET /api/users/id/:id
   * @desc    Récupérer un utilisateur par ID
   * @access  Public
   */
  getById: createEndpoint<{ id: string }>('GET', `${BASE_PATH}/id/:id`, {
    description: 'Récupérer un utilisateur par ID',
    access: 'public',
  }),

  /**
   * @route   GET /api/users/email/:email
   * @desc    Récupérer un utilisateur par email
   * @access  Public
   */
  getByEmail: createEndpoint<{ email: string }>('GET', `${BASE_PATH}/email/:email`, {
    description: 'Récupérer un utilisateur par email',
    access: 'public',
  }),

  /**
   * @route   GET /api/users
   * @desc    Récupérer tous les utilisateurs
   * @access  Public
   */
  getAll: createEndpoint('GET', BASE_PATH, {
    description: 'Récupérer tous les utilisateurs',
    access: 'public',
  }),
} as const;
