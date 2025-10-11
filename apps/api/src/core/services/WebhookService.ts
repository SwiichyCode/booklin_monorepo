/**
 * WebhookService
 *
 * Service du domaine qui implémente la logique de traitement des webhooks.
 * Orchestre les use cases et coordonne les entités du domaine.
 */

import { injectable, inject } from 'tsyringe';
import type { ProcessWebhookCommand } from '../ports/in/ProcessWebhookUseCase';
import type { VerifyWebhookCommand } from '../ports/in/VerifyWebhookUseCase';
import { WebhookEvent, type WebhookEventType } from '../domain/entities/WebhookEvent';
import { Webhook, type WebhookRequiredHeaders } from 'svix';
import { ValidationError } from '../domain/errors/DomainError';
import { UserRole } from '../domain/entities/User';

// Import des use cases User
import type { CreateUserCommand } from '../ports/in/CreateUserUseCase';
import type { UpdateUserCommand } from '../ports/in/UpdateUserUseCase';
import type { DeleteUserCommand } from '../ports/in/DeleteUserUseCase';

// Interface pour le UserService (on injecte via DI)
interface IUserService {
  createUser(command: CreateUserCommand): Promise<any>;
  updateUser(command: UpdateUserCommand): Promise<any>;
  deleteUser(command: DeleteUserCommand): Promise<any>;
}

@injectable()
export class WebhookService {
  constructor(@inject('UserService') private userService: IUserService) {}

  // Use case : Vérifier un webhook (VerifyWebhookUseCase)
  async verifyWebhook(command: VerifyWebhookCommand): Promise<WebhookEvent> {
    const svix = new Webhook(command.secret);

    try {
      const event = svix.verify(command.payload, {
        'svix-id': command.headers['svix-id'],
        'svix-timestamp': command.headers['svix-timestamp'],
        'svix-signature': command.headers['svix-signature'],
      } as WebhookRequiredHeaders);

      const webhookEvent = WebhookEvent.createVerified({
        id: command.headers['svix-id'],
        type: (event as any).type as WebhookEventType,
        data: (event as any).data,
        timestamp: new Date(parseInt(command.headers['svix-timestamp'], 10) * 1000),
      });

      // Vérifier que l'événement est récent
      if (!webhookEvent.isRecent()) {
        throw new ValidationError('Webhook timestamp too old or too far in future');
      }

      return webhookEvent;
    } catch (error) {
      throw new ValidationError('Invalid webhook signature');
    }
  }

  // Use case : Traiter un événement webhook (ProcessWebhookUseCase)
  async processWebhook(command: ProcessWebhookCommand): Promise<void> {
    const webhookEvent = WebhookEvent.createVerified({
      id: command.eventId,
      type: command.eventType as WebhookEventType,
      data: command.eventData,
      timestamp: command.timestamp,
    });

    if (!webhookEvent.isUserEvent()) {
      console.warn(`[Webhook Service] Unknown event type: ${webhookEvent.type}`);
      return;
    }

    await this.processUserEvent(webhookEvent);
  }

  // Logique privée : Traiter les événements utilisateur
  private async processUserEvent(event: WebhookEvent): Promise<void> {
    const userData = event.extractClerkUserData();

    switch (event.type) {
      case 'user.created':
        await this.handleUserCreated(userData);
        break;

      case 'user.updated':
        await this.handleUserUpdated(userData);
        break;

      case 'user.deleted':
        await this.handleUserDeleted(userData.id);
        break;
    }
  }

  private async handleUserCreated(userData: {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  }): Promise<void> {
    try {
      await this.userService.createUser({
        id: userData.id,
        email: userData.email,
        role: UserRole.CLIENT,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
      console.info(`[Webhook Service] User created: ${userData.id}`);
    } catch (error) {
      console.error('[Webhook Service] Error creating user:', error);
      throw error;
    }
  }

  private async handleUserUpdated(userData: {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  }): Promise<void> {
    try {
      await this.userService.updateUser({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
      console.info(`[Webhook Service] User updated: ${userData.id}`);
    } catch (error) {
      console.error('[Webhook Service] Error updating user:', error);
      throw error;
    }
  }

  private async handleUserDeleted(id: string): Promise<void> {
    try {
      await this.userService.deleteUser({ id });
      console.info(`[Webhook Service] User deleted: ${id}`);
    } catch (error) {
      console.error('[Webhook Service] Error deleting user:', error);
      throw error;
    }
  }
}
