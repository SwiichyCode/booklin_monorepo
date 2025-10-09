/**
 * Port IN : ProcessWebhookUseCase
 *
 * Use case pour traiter un événement webhook.
 * Définit le contrat que le service doit implémenter.
 */

import type { WebhookEvent } from '../../domain/entities/WebhookEvent';

export interface ProcessWebhookCommand {
  eventId: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: Date;
}

export interface ProcessWebhookUseCase {
  execute(command: ProcessWebhookCommand): Promise<void>;
}
