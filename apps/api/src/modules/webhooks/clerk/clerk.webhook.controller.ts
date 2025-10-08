import type { Request, Response } from 'express';
import type { WebhookEvent } from '@clerk/express';
import { ClerkWebhookService } from './clerk.webhook.service';

export class ClerkWebhookController {
  constructor(private service: ClerkWebhookService) {}

  handleWebhook = async (req: Request, res: Response) => {
    try {
      // Le middleware verifyClerkWebhook a déjà vérifié et attaché l'event
      const event = (req as any).webhookEvent as WebhookEvent;

      if (!event) {
        return res.status(400).json({
          success: false,
          error: 'No webhook event found',
        });
      }

      await this.service.processEvent(event);

      res.status(200).json({
        success: true,
        message: 'Clerk webhook processed successfully',
      });
    } catch (error) {
      console.error('[Clerk Webhook] Error processing webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process Clerk webhook',
      });
    }
  };
}
