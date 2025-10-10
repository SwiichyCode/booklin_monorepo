import express, { Express } from 'express';
import request from 'supertest';

/**
 * Helper pour créer une app Express de test
 */
export function createTestApp(): Express {
  const app = express();
  app.use(express.json());
  return app;
}

/**
 * Helper pour faire des requêtes de test
 */
export function createTestRequest(app: Express) {
  return request(app);
}

/**
 * Mock d'un utilisateur authentifié (pour Clerk)
 */
export const mockAuthUser = {
  id: 'user_test123',
  emailAddresses: [{ emailAddress: 'test@example.com' }],
  firstName: 'Test',
  lastName: 'User',
};

/**
 * Mock du middleware d'auth Clerk
 */
export const mockClerkAuth = (userId: string = mockAuthUser.id) => {
  return (req: any, _res: any, next: any) => {
    req.auth = { userId };
    next();
  };
};
