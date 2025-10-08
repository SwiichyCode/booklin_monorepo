import type { WebhookEvent } from '@clerk/express';

export type ClerkWebhookEvent = WebhookEvent;

export interface ClerkUserData {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string | null;
  last_name: string | null;
}

export type ClerkEventType = 'user.created' | 'user.updated' | 'user.deleted';
