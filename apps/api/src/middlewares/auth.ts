/**
 * Middleware d'authentification JWT
 *
 * Ce middleware vérifie la présence et la validité du token JWT
 * dans les requêtes. Il protège les routes qui nécessitent une authentification.
 *
 * Flow:
 * 1. Extraire le token du header Authorization
 * 2. Vérifier et décoder le token avec jwt.verify()
 * 3. Attacher les données utilisateur à req.user
 * 4. Passer au middleware suivant
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../shared/types/errors';

/**
 * Interface pour les données décodées du JWT
 * Étendez cette interface selon vos besoins
 */
export interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
}

/**
 * Étendre le type Request d'Express pour inclure user
 * Permet d'utiliser req.user dans les controllers avec TypeScript
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware d'authentification
 * Vérifie le JWT et attache l'utilisateur à req.user
 *
 * @throws UnauthorizedError si le token est manquant ou invalide
 *
 * @example
 * router.get('/profile', authenticate, userController.getProfile);
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // 1. Extraire le token du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Invalid token');
    }

    // 2. Vérifier et décoder le token
    const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as JwtPayload;

    // 3. Attacher l'utilisateur à la requête
    req.user = decoded;

    // 4. Passer au middleware suivant
    next();
  } catch (error) {
    // Les erreurs JWT (TokenExpiredError, JsonWebTokenError) sont gérées par errorHandler
    next(error);
  }
};

/**
 * Middleware pour vérifier les rôles utilisateur
 * À utiliser APRÈS authenticate
 *
 * @param allowedRoles - Liste des rôles autorisés
 *
 * @example
 * router.delete('/books/:id', authenticate, authorize(['admin']), bookController.delete);
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const userRole = req.user.role || 'user';

    if (!allowedRoles.includes(userRole)) {
      throw new UnauthorizedError(`Role '${userRole}' is not authorized`);
    }

    next();
  };
};

/**
 * Helper pour générer un JWT
 *
 * @example
 * const token = generateToken({ userId: user.id, email: user.email });
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload,
    env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions,
  );
};

/**
 * Helper pour générer un refresh token
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET as jwt.Secret,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as jwt.SignOptions,
  );
};
