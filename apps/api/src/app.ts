import express from 'express';
import cors from 'cors';
import routes from './routes';
import type { Express } from 'express';

export const createApp = (): Express => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', routes);
  return app;
};
