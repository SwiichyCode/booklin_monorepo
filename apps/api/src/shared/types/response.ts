/**
 * Types pour les réponses API standardisées
 *
 * Ces types garantissent que toutes les réponses de l'API suivent
 * le même format, ce qui facilite le parsing côté frontend.
 */

/**
 * Réponse de succès générique
 * Utilisée pour encapsuler les données retournées par l'API
 *
 * @example
 * {
 *   success: true,
 *   data: { id: 1, title: "Book Title" }
 * }
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Réponse d'erreur générique
 * Utilisée pour retourner les erreurs de manière cohérente
 *
 * @example
 * {
 *   success: false,
 *   error: {
 *     message: "Book not found",
 *     code: "NOT_FOUND"
 *   }
 * }
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: Record<string, string[]>;
  };
}

/**
 * Réponse paginée
 * Utilisée pour les listes avec pagination
 *
 * @example
 * {
 *   success: true,
 *   data: [...],
 *   pagination: {
 *     page: 1,
 *     limit: 10,
 *     total: 50,
 *     totalPages: 5
 *   }
 * }
 */
export interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Helper pour créer une réponse de succès
 */
export const successResponse = <T>(data: T, message?: string): ApiSuccessResponse<T> => ({
  success: true,
  data,
  message,
});

/**
 * Helper pour créer une réponse d'erreur
 */
export const errorResponse = (
  message: string,
  code?: string,
  details?: Record<string, string[]>
): ApiErrorResponse => ({
  success: false,
  error: {
    message,
    code,
    details,
  },
});
