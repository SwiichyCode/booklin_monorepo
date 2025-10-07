/**
 * Types et classes d'erreurs personnalisées
 *
 * Ces classes permettent de typer les erreurs et de les gérer de manière cohérente
 * dans toute l'application.
 */

/**
 * Erreur de base de l'application
 * Toutes les erreurs métier héritent de cette classe
 */
export class AppError extends Error {
  /**
   * @param statusCode - Code HTTP (400, 404, 500, etc.)
   * @param message - Message d'erreur
   * @param isOperational - true = erreur attendue (validation, etc.), false = bug
   */
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Erreur 400 - Bad Request
 * Utilisée pour les erreurs de validation, paramètres manquants, etc.
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(400, message);
  }
}

/**
 * Erreur 401 - Unauthorized
 * Utilisée quand l'authentification est requise ou invalide
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

/**
 * Erreur 403 - Forbidden
 * Utilisée quand l'utilisateur n'a pas les permissions nécessaires
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

/**
 * Erreur 404 - Not Found
 * Utilisée quand une ressource n'existe pas
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

/**
 * Erreur 409 - Conflict
 * Utilisée pour les conflits (email déjà utilisé, etc.)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

/**
 * Erreur 422 - Unprocessable Entity
 * Utilisée pour les erreurs de validation métier
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(422, message);
  }
}

/**
 * Erreur 500 - Internal Server Error
 * Utilisée pour les erreurs inattendues (bugs)
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, message, false); // isOperational = false
  }
}
