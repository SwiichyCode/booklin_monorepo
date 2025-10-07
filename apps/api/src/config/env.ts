/**
 * Configuration et validation des variables d'environnement
 *
 * Ce fichier centralise toutes les variables d'environnement de l'application
 * et utilise Zod pour valider leur présence et format au démarrage.
 *
 * Avantages:
 * - Type-safety: TypeScript connaît les types exacts
 * - Validation: L'app crash au démarrage si config invalide (fail-fast)
 * - Centralisation: Un seul endroit pour toute la config
 */

import { z } from 'zod';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

/**
 * Schéma de validation des variables d'environnement
 * Zod va vérifier la présence et le format de chaque variable
 */
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000').transform(Number),

  // Database (optionnel pour l'exemple, décommenter si vous ajoutez une DB)
  // DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET doit faire au moins 32 caractères'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET doit faire au moins 32 caractères'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // CORS
  ALLOWED_ORIGINS: z.string().transform(val => val.split(',')),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),

  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

/**
 * Parse et valide les variables d'environnement
 * Si la validation échoue, l'application crash avec un message d'erreur détaillé
 */
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Configuration invalide:');
    if (error instanceof z.ZodError) {
      error.issues.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    console.error('\n💡 Vérifiez votre fichier .env à la racine de apps/api/');
    process.exit(1);
  }
};

/**
 * Configuration exportée et typée
 * Utilisez `env.PORT`, `env.JWT_SECRET`, etc. dans votre code
 */
export const env = parseEnv();

/**
 * Helper pour vérifier l'environnement
 */
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
