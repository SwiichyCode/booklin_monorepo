/**
 * Configuration des endpoints API
 */

/**
 * Préfixe de base pour toutes les routes API
 */
export const API_BASE_PREFIX = '/api';

/**
 * Helper pour construire une URL complète avec le préfixe API
 */
export function buildApiUrl(path: string): string {
  return `${API_BASE_PREFIX}${path}`;
}

/**
 * Helper pour construire une URL complète avec base URL et préfixe API
 * Utile côté client pour faire des requêtes
 */
export function buildFullApiUrl(baseUrl: string, path: string): string {
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}${API_BASE_PREFIX}${path}`;
}
