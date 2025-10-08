import type { Request, Response, NextFunction } from 'express';
import { Webhook, type WebhookRequiredHeaders } from 'svix';
import type { WebhookEvent } from '@clerk/express';

export const verifyClerkWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('[Webhook] CLERK_WEBHOOK_SECRET is not defined');
      return res.status(500).json({
        success: false,
        error: 'Webhook secret not configured',
      });
    }

    const svix = new Webhook(webhookSecret);
    const payload = JSON.stringify(req.body);
    const headers = req.headers;

    // Vérification de la présence des headers requis
    if (!headers['svix-id'] || !headers['svix-timestamp'] || !headers['svix-signature']) {
      return res.status(400).json({
        success: false,
        error: 'Missing required Svix headers',
      });
    }

    // Vérification timestamp (protection replay)

    const timestamp = parseInt(headers['svix-timestamp'] as string, 10);
    const now = Math.floor(Date.now() / 1000);
    const TOLERANCE = 300; // 5 minutes

    if (Math.abs(now - timestamp) > TOLERANCE) {
      return res.status(400).json({
        success: false,
        error: 'Webhook timestamp too old or too far in future',
      });
    }

    // Vérification de la signature
    const event = svix.verify(payload, {
      'svix-id': headers['svix-id'] as string,
      'svix-timestamp': headers['svix-timestamp'] as string,
      'svix-signature': headers['svix-signature'] as string,
    } as WebhookRequiredHeaders) as WebhookEvent;

    // Attacher l'event vérifié à la requête pour le controller
    (req as any).webhookEvent = event;

    next();
  } catch (error) {
    console.error('[Webhook] Invalid webhook signature:', error);
    return res.status(400).json({
      success: false,
      error: 'Invalid webhook signature',
    });
  }
};
