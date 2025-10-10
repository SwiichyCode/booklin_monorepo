import cors from 'cors';
import type { CorsOptions } from 'cors';
import { env, envConfig } from '@/shared/config/env';

/**
 * CORS configuration for the API
 * Adapts allowed origins based on environment
 */
export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // In development, allow all origins
    if (envConfig.isDevelopment()) {
      return callback(null, true);
    }

    // In production, check the whitelist
    if (env.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // Allow cookies/auth headers
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

export const corsMiddleware = cors(corsConfig);
