import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { $Enums } from '@prisma/client';
import { container } from 'tsyringe';
import { ProProfileController } from '@/adapters/in/http/controllers/ProProfileController';
import { RequireAuthMiddleware, RequireRolesMiddleware } from '../middleware/auth';
import { endpoints, getRelativePath, BASE_PATH as PRO_PROFILES_BASE_PATH } from '@repo/endpoints';

const router: ExpressRouter = Router();
const proProfileController = container.resolve(ProProfileController);
const requireRolesMiddleware = container.resolve(RequireRolesMiddleware);

// ========================================
// CRUD Routes
// ========================================

/**
 * @route   POST /api/pro-profiles
 * @desc    Create a new professional profile
 * @access  Private (authenticated user)
 */
router.post(
  getRelativePath(endpoints.proProfiles.create.path, PRO_PROFILES_BASE_PATH),
  requireRolesMiddleware.handle($Enums.UserRole.CLIENT),
  (req, res) => proProfileController.createProProfile(req, res),
);

/**
 * @route   PATCH /api/pro-profiles/:id
 * @desc    Update a professional profile
 * @access  Private (profile owner or admin)
 */
router.patch('/:id', (req, res) => proProfileController.updateProProfile(req, res));

/**
 * @route   DELETE /api/pro-profiles/:id
 * @desc    Delete a professional profile
 * @access  Private (profile owner or admin)
 */
router.delete('/:id', (req, res) => proProfileController.deleteProProfile(req, res));

/**
 * @route   GET /api/pro-profiles/:id
 * @desc    Get professional profile by ID
 * @access  Public
 */
router.get('/:id', (req, res) => proProfileController.getProProfileById(req, res));

/**
 * @route   GET /api/pro-profiles/user/:userId
 * @desc    Get professional profile by user ID (Clerk ID)
 * @access  Authenticated
 */
router.get('/user/:userId', RequireAuthMiddleware(), (req, res) =>
  proProfileController.getProProfileByUserId(req, res),
);

/**
 * @route   GET /api/pro-profiles
 * @desc    Get all professional profiles with filters
 * @access  Public
 * @query   profession, city, isPremium, validationStatus, isActive
 */
router.get('/', (req, res) => proProfileController.getAllProProfiles(req, res));

// ========================================
// Approval Routes
// ========================================

/**
 * @route   POST /api/pro-profiles/:id/approve
 * @desc    Approve a professional profile
 * @access  Private (admin only)
 */
router.post('/:id/approve', (req, res) => proProfileController.approveProProfile(req, res));

/**
 * @route   POST /api/pro-profiles/:id/reject
 * @desc    Reject a professional profile
 * @access  Private (admin only)
 */
router.post('/:id/reject', (req, res) => proProfileController.rejectProProfile(req, res));

// ========================================
// Premium Management Routes
// ========================================

/**
 * @route   POST /api/pro-profiles/:id/premium/activate
 * @desc    Activate premium subscription
 * @access  Private (profile owner or admin)
 */
router.post('/:id/premium/activate', (req, res) => proProfileController.activatePremium(req, res));

/**
 * @route   POST /api/pro-profiles/:id/premium/renew
 * @desc    Renew premium subscription
 * @access  Private (profile owner or admin)
 */
router.post('/:id/premium/renew', (req, res) => proProfileController.renewPremium(req, res));

/**
 * @route   POST /api/pro-profiles/:id/premium/deactivate
 * @desc    Deactivate premium subscription
 * @access  Private (profile owner or admin)
 */
router.post('/:id/premium/deactivate', (req, res) => proProfileController.deactivatePremium(req, res));

export default router;
