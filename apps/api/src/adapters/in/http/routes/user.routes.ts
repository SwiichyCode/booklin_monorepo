import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { container } from '@/shared/di/container';
import { UserController } from '@/adapters/in/http/controllers/UserController';
import { endpoints, getRelativePath, BASE_PATH as USERS_BASE_PATH } from '@repo/endpoints';
import { RequireAuthMiddleware } from '../middleware/auth';

const router: ExpressRouter = Router();
const userController = container.resolve(UserController);

// ========================================
// CRUD Routes
// ========================================

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Private (authenticated user)
 */
router.post(getRelativePath(endpoints.users.create.path, USERS_BASE_PATH), RequireAuthMiddleware(), (req, res) =>
  userController.createUser(req, res),
);

/**
 * @route   PATCH /api/users/:clerkId
 * @desc    Update a user
 * @access  Private (authenticated user)
 */
router.patch('/:clerkId', (req, res) => userController.updateUser(req, res));

/**
 * @route   DELETE /api/users/:clerkId
 * @desc    Delete a user
 * @access  Private (authenticated user)
 */
router.delete('/:clerkId', (req, res) => userController.deleteUser(req, res));

/**
 * @route   GET /api/users/:clerkId
 * @desc    Get user by Clerk ID
 * @access  Public
 */
router.get('/clerk/:clerkId', (req, res) => userController.getUserByClerkId(req, res));

/**
 * @route   GET /api/users/id/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/id/:id', (req, res) => userController.getUserById(req, res));

/**
 * @route   GET /api/users/email/:email
 * @desc    Get user by email
 * @access  Public
 */
router.get('/email/:email', (req, res) => userController.getUserByEmail(req, res));

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', (req, res) => userController.getUsers(req, res));

export { router as userRoutes };
