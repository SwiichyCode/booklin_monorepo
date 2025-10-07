/**
 * Middleware de validation Zod
 *
 * Ce middleware permet de valider facilement les données entrantes
 * (body, params, query) avec Zod avant qu'elles n'atteignent le controller.
 *
 * Avantages:
 * - Type-safety: Les types TypeScript sont automatiquement inférés
 * - DRY: Un seul endroit pour définir validation + types
 * - Erreurs claires: Messages d'erreur détaillés pour le frontend
 */

import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

/**
 * Crée un middleware de validation Zod
 *
 * @param schema - Schéma Zod à utiliser pour la validation
 * @returns Middleware Express
 *
 * @example
 * const createBookSchema = z.object({
 *   body: z.object({
 *     title: z.string().min(1),
 *     author: z.string().min(1),
 *   }),
 * });
 *
 * router.post('/books', validate(createBookSchema), bookController.create);
 */
export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valider body, params et query
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      // Le errorHandler global va gérer l'erreur ZodError
      next(error);
    }
  };
};

/**
 * Middleware pour parser et valider le body uniquement
 * Version simplifiée pour les cas courants
 *
 * @example
 * const createBookBodySchema = z.object({
 *   title: z.string().min(1),
 *   author: z.string().min(1),
 * });
 *
 * router.post('/books', validateBody(createBookBodySchema), bookController.create);
 */
export const validateBody = <T extends ZodObject>(schema: T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
