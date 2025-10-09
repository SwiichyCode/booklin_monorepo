/**
 * Middleware de vérification des webhooks Clerk
 *
 * Adaptateur HTTP qui utilise le WebhookService du domaine
 * pour vérifier et valider les webhooks Clerk.
 */

import type { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import type { VerifyWebhookUseCase } from '../../../../core/ports/in/VerifyWebhookUseCase';
import { envConfig } from '../../../../shared/config/env';

export const verifyClerkWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const webhookSecret = envConfig.get().clerkWebhookSecret;

    if (!webhookSecret) {
      console.error('[Webhook Middleware] CLERK_WEBHOOK_SECRET is not defined');
      return res.status(500).json({
        success: false,
        error: 'Webhook secret not configured',
      });
    }

    // Vérification de la présence des headers requis
    const headers = req.headers;
    if (!headers['svix-id'] || !headers['svix-timestamp'] || !headers['svix-signature']) {
      return res.status(400).json({
        success: false,
        error: 'Missing required Svix headers',
      });
    }

    // Utiliser le service du domaine pour vérifier le webhook
    const webhookService = container.resolve<VerifyWebhookUseCase>('VerifyWebhookUseCase');

    const webhookEvent = await webhookService.execute({
      payload: JSON.stringify(req.body),
      headers: {
        'svix-id': headers['svix-id'] as string,
        'svix-timestamp': headers['svix-timestamp'] as string,
        'svix-signature': headers['svix-signature'] as string,
      },
      secret: webhookSecret,
    });

    // Attacher l'événement vérifié à la requête pour le controller
    (req as any).webhookEvent = webhookEvent;

    next();
  } catch (error) {
    console.error('[Webhook Middleware] Verification failed:', error);
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Invalid webhook signature',
    });
  }
};
