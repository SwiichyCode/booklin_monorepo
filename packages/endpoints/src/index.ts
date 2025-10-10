/**
 * @repo/endpoints
 *
 * Package centralisé pour tous les endpoints API de Booklin.
 * Utilisable côté backend (Express) et frontend (Next.js) pour garantir
 * la cohérence des routes API.
 */

// Export de la lib (types, config, helpers)
export * from './lib';

// Export des endpoints
export * from './endpoints';

// Re-export groupé pour faciliter l'import
import { userEndpoints } from './endpoints/users';
import { proProfileEndpoints } from './endpoints/proProfiles';
import { webhookEndpoints } from './endpoints/webhooks';

/**
 * Objet contenant tous les endpoints de l'application
 */
export const endpoints = {
  users: userEndpoints,
  proProfiles: proProfileEndpoints,
  webhooks: webhookEndpoints,
} as const;
