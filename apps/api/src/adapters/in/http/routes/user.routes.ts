import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { container } from '../../../../shared/di/container';
import { UserController } from '../controllers/UserController';

const router: ExpressRouter = Router();
const userController = container.resolve(UserController);

// Routes User
router.post('/', (req, res) => userController.createUser(req, res));
router.patch('/:clerkId', (req, res) => userController.updateUser(req, res));
router.delete('/:clerkId', (req, res) => userController.deleteUser(req, res));
router.get('/clerk/:clerkId', (req, res) => userController.getUserByClerkId(req, res));
router.get('/id/:id', (req, res) => userController.getUserById(req, res));
router.get('/email/:email', (req, res) => userController.getUserByEmail(req, res));
router.get('/', (req, res) => userController.getUsers(req, res));

export { router as userRoutes };
