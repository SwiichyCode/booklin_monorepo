/**
 * Webhooks Routes
 *
 * Routes pour les webhooks (Clerk, Stripe, etc.)
 * Utilise le WebhookController injecté via DI.
 */

import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { container } from 'tsyringe';
import { WebhookController } from '../controllers/WebhookController';
import { verifyClerkWebhook } from '../middleware/verifyWebhook';

const router: ExpressRouter = Router();

// Résoudre le controller depuis le container DI
const webhookController = container.resolve(WebhookController);

// Clerk Webhooks
router.post('/clerk', verifyClerkWebhook, (req, res) => webhookController.handleClerkWebhook(req, res));

// Stripe Webhooks (à venir)
// router.post('/stripe', verifyStripeWebhook, (req, res) => webhookController.handleStripeWebhook(req, res));

export { router as webhooksRoutes };
