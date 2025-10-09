import 'reflect-metadata'; // IMPORTANT: doit être en premier !
import express from 'express';
import type { Express } from 'express';

// Configuration
import { setupContainer } from './shared/di/container';
import { corsMiddleware } from './adapters/in/http/config/cors.config';
import { requestLogger } from './adapters/in/http/middleware/logger';
import { errorHandler, notFoundHandler } from './adapters/in/http/middleware/errorHandler';

// Setup Dependency Injection AVANT d'importer les routes
setupContainer();

// Routes (importées APRÈS setupContainer)
import routes from './routes';

export const createApp = (): Express => {
  const app = express();

  // Middlewares globaux
  app.use(corsMiddleware); // CORS configuré
  app.use(express.json()); // Parse JSON body
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body
  app.use(requestLogger); // Logger des requêtes

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // Routes de l'API
  app.use('/api', routes);

  // Middleware de gestion des erreurs (doit être APRÈS les routes)
  app.use(notFoundHandler); // 404
  app.use(errorHandler); // Erreurs globales

  return app;
};
