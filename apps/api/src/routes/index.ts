import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import webhooksRoutes from '../modules/webhooks/webhooks.routes';

const router: ExpressRouter = Router();

// Webhooks
router.use('/webhooks', webhooksRoutes);

export default router;
