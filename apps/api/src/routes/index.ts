import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import authRoutes from '../modules/auth/auth.routes';

const router: ExpressRouter = Router();
router.use('/auth', authRoutes);

export default router;
