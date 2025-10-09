import { Router, type Router as ExpressRouter } from 'express';

import { ProProfileController } from './pro-profile.controller';
import { ProProfileRepository } from './pro-profile.repository';
import { ProProfileService } from './pro-profile.service';
import { UserRepository } from '../users';

const proProfileRepo = new ProProfileRepository();
const userRepo = new UserRepository();
const service = new ProProfileService(proProfileRepo, userRepo);
const controller = new ProProfileController(service);

const router: ExpressRouter = Router();

router.post('/', controller.create);
router.get('/me', controller.getMe);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
