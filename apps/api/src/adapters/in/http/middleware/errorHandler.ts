import type { Request, Response, NextFunction } from 'express';
import { DomainError, ValidationError, NotFoundError } from '@/core/domain/errors/DomainError';
import { envConfig } from '@/shared/config/env';

/**
 * Interface pour les erreurs standardisées
 */
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
    stack?: string;
  };
}

/**
 * Middleware global de gestion des erreurs
 * Convertit les erreurs du domaine en réponses HTTP appropriées
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  // Log l'erreur (en production, utiliser un logger comme Winston)
  console.error('[Error Handler]', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Erreurs du domaine
  if (err instanceof ValidationError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: 'VALIDATION_ERROR',
      },
    };
    res.status(400).json(response);
    return;
  }

  if (err instanceof NotFoundError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: 'NOT_FOUND',
      },
    };
    res.status(404).json(response);
    return;
  }

  if (err instanceof DomainError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: 'DOMAIN_ERROR',
      },
    };
    res.status(400).json(response);
    return;
  }

  // Erreurs Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;

    if (prismaError.code === 'P2002') {
      const response: ErrorResponse = {
        success: false,
        error: {
          message: 'A record with this value already exists',
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
        },
      };
      res.status(409).json(response);
      return;
    }

    if (prismaError.code === 'P2025') {
      const response: ErrorResponse = {
        success: false,
        error: {
          message: 'Record not found',
          code: 'NOT_FOUND',
        },
      };
      res.status(404).json(response);
      return;
    }
  }

  // Erreur générique
  const response: ErrorResponse = {
    success: false,
    error: {
      message: envConfig.isProduction() ? 'An unexpected error occurred' : err.message,
      code: 'INTERNAL_SERVER_ERROR',
      // En développement, inclure la stack trace
      ...(envConfig.isDevelopment() && { stack: err.stack }),
    },
  };

  res.status(500).json(response);
}

/**
 * Middleware pour gérer les routes non trouvées (404)
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const response: ErrorResponse = {
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'ROUTE_NOT_FOUND',
    },
  };
  res.status(404).json(response);
}
