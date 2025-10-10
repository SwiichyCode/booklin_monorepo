import 'reflect-metadata'; // IMPORTANT: must be first!
import express from 'express';
import { clerkClient, clerkMiddleware, getAuth } from '@clerk/express';
import type { Express } from 'express';

// Configuration
import { setupContainer } from './shared/di/container';
import { corsMiddleware } from './adapters/in/http/config/cors.config';
import { requestLogger } from './adapters/in/http/middleware/logger';
import { errorHandler, notFoundHandler } from './adapters/in/http/middleware/errorHandler';

// Setup Dependency Injection BEFORE importing routes
setupContainer();

// Routes (imported AFTER setupContainer)
import routes from '@/adapters/in/http/routes';

export const createApp = (): Express => {
  const app = express();

  // Global middlewares
  app.use(corsMiddleware); // CORS configured
  app.use(express.json()); // Parse JSON body
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body
  app.use(requestLogger); // Request logger
  app.use(clerkMiddleware()); // Clerk middleware

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // API routes
  app.use('/api', routes);

  // Error handling middleware (must be AFTER routes)
  app.use(notFoundHandler); // 404
  app.use(errorHandler); // Global errors

  return app;
};
