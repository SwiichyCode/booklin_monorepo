/**
 * Types pour la définition des endpoints API
 */

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface RouteParams {
  [key: string]: string;
}

export interface QueryParams {
  [key: string]: string | string[] | undefined;
}

/**
 * Définition d'un endpoint API
 */
export interface Endpoint<TParams extends RouteParams = RouteParams> {
  /** Méthode HTTP */
  method: HttpMethod;
  /** Chemin de base de l'endpoint (ex: /users/:id) */
  path: string;
  /** Description de l'endpoint */
  description?: string;
  /** Niveau d'accès requis */
  access?: 'public' | 'private' | 'admin';
  /** Fonction pour générer l'URL complète avec les paramètres */
  build: (params?: TParams, query?: QueryParams) => string;
}

/**
 * Helper pour créer un endpoint typé
 */
export function createEndpoint<TParams extends RouteParams = RouteParams>(
  method: HttpMethod,
  path: string,
  options?: {
    description?: string;
    access?: 'public' | 'private' | 'admin';
  }
): Endpoint<TParams> {
  return {
    method,
    path,
    description: options?.description,
    access: options?.access,
    build: (params?: TParams, query?: QueryParams) => {
      let url = path;

      // Remplacer les paramètres de route (:id, :clerkId, etc.)
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url = url.replace(`:${key}`, encodeURIComponent(value));
        });
      }

      // Ajouter les query params
      if (query) {
        const queryString = Object.entries(query)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`;
          })
          .join('&');

        if (queryString) {
          url += `?${queryString}`;
        }
      }

      return url;
    },
  };
}
