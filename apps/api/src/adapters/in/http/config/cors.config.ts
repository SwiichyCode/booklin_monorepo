import cors from 'cors';
import type { CorsOptions } from 'cors';
import { env, envConfig } from '../../../../shared/config/env';

/**
 * Configuration CORS pour l'API
 * Adapte les origines autorisées selon l'environnement
 */
export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // En développement, autoriser toutes les origines
    if (envConfig.isDevelopment()) {
      return callback(null, true);
    }

    // En production, vérifier la whitelist
    if (env.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // Permettre les cookies/auth headers
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],
};

export const corsMiddleware = cors(corsConfig);
