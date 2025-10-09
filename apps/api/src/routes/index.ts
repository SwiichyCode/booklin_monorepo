import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import webhooksRoutes from '../modules/webhooks/webhooks.routes';
import proProfilesRoutes from '../modules/pro-profiles/pro-profiles.routes';
import { userRoutes } from '../adapters/in/http/routes/user.routes';

const router: ExpressRouter = Router();

// Webhooks
router.use('/webhooks', webhooksRoutes);
router.use('/pro-profiles', proProfilesRoutes);

// Users (Hexagonal Architecture)
router.use('/users', userRoutes);

export default router;
