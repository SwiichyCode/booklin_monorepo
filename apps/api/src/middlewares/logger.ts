/**
 * Middleware de logging
 *
 * Utilise Pino pour logger toutes les requêtes HTTP avec des performances optimales.
 * Pino est l'un des loggers Node.js les plus rapides.
 */

import pino from 'pino';
import pinoHttp from 'pino-http';
import { env, isDevelopment } from '../config/env';

/**
 * Instance Pino configurée
 * En développement: format lisible (pretty-print)
 * En production: format JSON pour les outils d'agrégation de logs
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

/**
 * Middleware HTTP logger
 * Log automatiquement chaque requête avec:
 * - Méthode HTTP
 * - URL
 * - Status code
 * - Temps de réponse
 * - User agent
 */
export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} failed: ${err.message}`;
  },
});
