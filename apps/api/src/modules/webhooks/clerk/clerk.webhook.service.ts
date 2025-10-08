import type { WebhookEvent } from '@clerk/express';
import type { IUserService } from '../../users/user.service';
import { UserService } from '../../users/user.service';

export class ClerkWebhookService {
  constructor(private userService: IUserService = new UserService()) {}

  async processEvent(event: WebhookEvent): Promise<void> {
    const { type, data } = event;

    switch (type) {
      case 'user.created':
        await this.handleUserCreated(data);
        break;

      case 'user.updated':
        await this.handleUserUpdated(data);
        break;

      case 'user.deleted':
        await this.handleUserDeleted(data);
        break;

      default:
        console.warn(`[Clerk Webhook] Unknown event type: ${type}`);
    }
  }

  private async handleUserCreated(data: any): Promise<void> {
    try {
      await this.userService.createUser({
        clerkId: data.id,
        email: data.email_addresses[0]?.email_address || null,
        role: 'CLIENT',
        firstName: data.first_name,
        lastName: data.last_name,
      });
      console.info(`[Clerk Webhook] User created: ${data.id}`);
    } catch (error) {
      console.error('[Clerk Webhook] Error creating user:', error);
      throw error;
    }
  }

  private async handleUserUpdated(data: any): Promise<void> {
    try {
      await this.userService.updateUser(data.id, {
        email: data.email_addresses[0]?.email_address || null,
        firstName: data.first_name,
        lastName: data.last_name,
      });
      console.info(`[Clerk Webhook] User updated: ${data.id}`);
    } catch (error) {
      console.error('[Clerk Webhook] Error updating user:', error);
      throw error;
    }
  }

  private async handleUserDeleted(data: any): Promise<void> {
    try {
      await this.userService.deleteUser(data.id);
      console.info(`[Clerk Webhook] User deleted: ${data.id}`);
    } catch (error) {
      console.error('[Clerk Webhook] Error deleting user:', error);
      throw error;
    }
  }
}
