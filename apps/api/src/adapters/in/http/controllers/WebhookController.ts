/**
 * WebhookController
 *
 * HTTP adapter for webhooks.
 * Transforms HTTP requests into domain commands.
 */

import { injectable, inject } from 'tsyringe';
import type { Request, Response } from 'express';
import type { ProcessWebhookUseCase } from '@/core/ports/in/ProcessWebhookUseCase';
import type { WebhookEvent } from '@/core/domain/entities/WebhookEvent';

@injectable()
export class WebhookController {
  constructor(@inject('ProcessWebhookUseCase') private processWebhookUseCase: ProcessWebhookUseCase) {}

  async handleClerkWebhook(req: Request, res: Response): Promise<void> {
    try {
      // The middleware has already verified and attached the event
      const event = (req as any).webhookEvent as WebhookEvent;

      if (!event) {
        res.status(400).json({
          success: false,
          error: 'No webhook event found',
        });
        return;
      }

      // Process the event via the use case
      await this.processWebhookUseCase.execute({
        eventId: event.id,
        eventType: event.type,
        eventData: event.data,
        timestamp: event.timestamp,
      });

      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
      });
    } catch (error) {
      console.error('[Webhook Controller] Error processing webhook:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process webhook',
      });
    }
  }
}
