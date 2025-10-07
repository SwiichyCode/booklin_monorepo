// apps/api/src/modules/auth/auth.routes.ts
import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { InMemoryAuthRepository } from './auth.repository';
import { authenticate } from '../../middlewares/auth';

const repo = new InMemoryAuthRepository();
const service = new AuthService(repo);
const controller = new AuthController(service);

const router: ExpressRouter = Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authenticate, controller.me);
router.post('/refresh', controller.refresh);
router.post('/logout', authenticate, controller.logout);

export default router;
