/**
 * Port IN : VerifyWebhookUseCase
 *
 * Use case pour vérifier la signature d'un webhook.
 * Définit le contrat que le service doit implémenter.
 */

import type { WebhookEvent } from '../../domain/entities/WebhookEvent';

export interface VerifyWebhookCommand {
  payload: string;
  headers: {
    'svix-id': string;
    'svix-timestamp': string;
    'svix-signature': string;
  };
  secret: string;
}

export interface VerifyWebhookUseCase {
  execute(command: VerifyWebhookCommand): Promise<WebhookEvent>;
}
