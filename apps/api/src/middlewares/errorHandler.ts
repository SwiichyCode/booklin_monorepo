/**
 * Middleware de gestion d'erreurs globale
 *
 * Ce middleware centralise la gestion de toutes les erreurs de l'application.
 * Il doit être le DERNIER middleware ajouté à Express.
 *
 * Flow:
 * 1. Une erreur est levée (throw) ou transmise via next(error)
 * 2. Express intercepte l'erreur et la passe à ce middleware
 * 3. Le middleware formate l'erreur en réponse JSON standardisée
 * 4. Le client reçoit une réponse HTTP avec le bon status code
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../shared/types/errors';
import { errorResponse } from '../shared/types/response';
import { logger } from './logger';
import { envConfig } from '../shared/config/env';

const isDevelopment = envConfig.isDevelopment();

/**
 * Middleware de gestion d'erreurs
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Si les headers sont déjà envoyés, déléguer à Express
  if (res.headersSent) {
    return next(err);
  }

  // Log l'erreur (avec stack trace en dev)
  logger.error({
    error: {
      message: err.message,
      stack: isDevelopment ? err.stack : undefined,
      name: err.name,
    },
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
    },
  });

  // Gestion des erreurs Zod (validation)
  if (err instanceof ZodError) {
    const errors = err.issues.reduce(
      (acc, error) => {
        const path = error.path.join('.');
        if (!acc[path]) acc[path] = [];
        acc[path].push(error.message);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    res.status(422).json(errorResponse('Validation failed', 'VALIDATION_ERROR', errors));
    return;
  }

  // Gestion des erreurs métier (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message, err.name.toUpperCase()));
    return;
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json(errorResponse('Invalid token', 'INVALID_TOKEN'));
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json(errorResponse('Token expired', 'TOKEN_EXPIRED'));
    return;
  }

  // Erreur inconnue (bug) - ne pas exposer les détails en production
  res.status(500).json(errorResponse(isDevelopment ? err.message : 'Internal server error', 'INTERNAL_SERVER_ERROR'));
};

/**
 * Middleware pour gérer les routes non trouvées (404)
 * À placer AVANT le errorHandler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(errorResponse(`Route ${req.method} ${req.url} not found`, 'NOT_FOUND'));
};
