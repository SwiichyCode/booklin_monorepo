import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import proProfilesRoutes from '../modules/pro-profiles/pro-profiles.routes';
import { userRoutes } from '../adapters/in/http/routes/user.routes';
import webhooksRoutes from '../adapters/in/http/routes/webhooks.routes';

const router: ExpressRouter = Router();

// Webhooks (Hexagonal Architecture)
router.use('/webhooks', webhooksRoutes);

// Pro Profiles (Old Architecture - to migrate)
router.use('/pro-profiles', proProfilesRoutes);

// Users (Hexagonal Architecture)
router.use('/users', userRoutes);

export default router;
