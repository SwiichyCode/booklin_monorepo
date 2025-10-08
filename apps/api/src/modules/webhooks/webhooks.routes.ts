import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { ClerkWebhookController, ClerkWebhookService } from './clerk';
import { verifyClerkWebhook } from '../../middlewares/verifyWebhook';

const router: ExpressRouter = Router();

// Clerk Webhooks
const clerkService = new ClerkWebhookService();
const clerkController = new ClerkWebhookController(clerkService);
router.post('/clerk', verifyClerkWebhook, clerkController.handleWebhook);

// Stripe Webhooks (à venir)
// const stripeService = new StripeWebhookService();
// const stripeController = new StripeWebhookController(stripeService);
// router.post('/stripe', verifyStripeWebhook, stripeController.handleWebhook);

export default router;
