/**
 * Endpoints pour les webhooks
 */

import { createEndpoint } from '../lib/types';

const BASE_PATH = '/webhooks';

export const webhookEndpoints = {
  /**
   * @route   POST /api/webhooks/clerk
   * @desc    Webhook Clerk pour la synchronisation des utilisateurs
   * @access  Public (vérifié par signature)
   */
  clerk: createEndpoint('POST', `${BASE_PATH}/clerk`, {
    description: 'Webhook Clerk pour la synchronisation des utilisateurs',
    access: 'public',
  }),

  /**
   * @route   POST /api/webhooks/stripe
   * @desc    Webhook Stripe pour les événements de paiement
   * @access  Public (vérifié par signature)
   * @note    À implémenter
   */
  stripe: createEndpoint('POST', `${BASE_PATH}/stripe`, {
    description: 'Webhook Stripe pour les événements de paiement',
    access: 'public',
  }),
} as const;
