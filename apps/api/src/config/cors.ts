/**
 * Configuration CORS (Cross-Origin Resource Sharing)
 *
 * Permet de contrôler quels domaines peuvent accéder à l'API.
 * Important pour la sécurité en production.
 */

import { CorsOptions } from 'cors';
import { env, isDevelopment } from './env';

/**
 * Configuration CORS
 * En développement: permissif pour faciliter le dev
 * En production: strict, uniquement les origines autorisées
 */
export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // En développement, autoriser les requêtes sans origin (Postman, curl, etc.)
    if (isDevelopment && !origin) {
      return callback(null, true);
    }

    // Vérifier si l'origine est dans la liste autorisée
    if (!origin || env.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // Autoriser les cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // Cache preflight pendant 24h
};
