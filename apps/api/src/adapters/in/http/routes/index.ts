import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { userRoutes } from '@/adapters/in/http/routes/user.routes';
import { webhooksRoutes } from '@/adapters/in/http/routes/webhooks.routes';
import proProfileRoutes from '@/adapters/in/http/routes/proProfile.routes';

const router: ExpressRouter = Router();

router.use('/webhooks', webhooksRoutes);
router.use('/users', userRoutes);
router.use('/pro-profiles', proProfileRoutes);

export default router;
