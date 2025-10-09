/**
 * WebhookEvent Domain Entity
 *
 * Représente un événement webhook dans le domaine.
 * Cette entité encapsule la logique métier liée aux événements webhook.
 */

export type WebhookEventType = 'user.created' | 'user.updated' | 'user.deleted';

export interface WebhookEventProps {
  id: string;
  type: WebhookEventType;
  data: Record<string, any>;
  timestamp: Date;
  verified: boolean;
}

export class WebhookEvent {
  private constructor(private readonly props: WebhookEventProps) {}

  // Factory method pour créer un événement vérifié
  static createVerified(props: Omit<WebhookEventProps, 'verified'>): WebhookEvent {
    return new WebhookEvent({
      ...props,
      verified: true,
    });
  }

  // Factory method pour reconstruction depuis la persistance
  static fromPersistence(props: WebhookEventProps): WebhookEvent {
    return new WebhookEvent(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get type(): WebhookEventType {
    return this.props.type;
  }

  get data(): Record<string, any> {
    return this.props.data;
  }

  get timestamp(): Date {
    return this.props.timestamp;
  }

  get isVerified(): boolean {
    return this.props.verified;
  }

  // Logique métier : extraction des données utilisateur Clerk
  extractClerkUserData(): {
    clerkId: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  } {
    const data = this.props.data;

    return {
      clerkId: data.id,
      email: data.email_addresses?.[0]?.email_address || null,
      firstName: data.first_name || null,
      lastName: data.last_name || null,
    };
  }

  // Logique métier : vérifier si l'événement est récent (protection replay)
  isRecent(toleranceInSeconds: number = 300): boolean {
    const now = new Date();
    const diff = Math.abs(now.getTime() - this.props.timestamp.getTime()) / 1000;
    return diff <= toleranceInSeconds;
  }

  // Logique métier : vérifier si c'est un événement utilisateur
  isUserEvent(): boolean {
    return ['user.created', 'user.updated', 'user.deleted'].includes(this.props.type);
  }
}
