import { Email } from '../value-objects/Email';
import { ValidationError } from '../errors/DomainError';

export enum UserRole {
  CLIENT = 'CLIENT',
  PRO = 'PRO',
}

export interface UserProps {
  id: string;
  clerkId: string;
  email: Email | null;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProps {
  clerkId: string;
  email: string | null;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
}

export class User {
  private constructor(private props: UserProps) {}

  // Factory method pour créer un nouvel utilisateur
  static create(data: CreateUserProps): User {
    if (!data.clerkId) {
      throw new ValidationError('ClerkId is required');
    }

    const email = data.email ? new Email(data.email) : null;

    return new User({
      id: '', // Sera généré par la DB
      clerkId: data.clerkId,
      email,
      role: data.role,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      phone: null,
      avatar: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Factory method pour reconstruire depuis la DB
  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get clerkId(): string {
    return this.props.clerkId;
  }

  get email(): Email | null {
    return this.props.email;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get firstName(): string | null {
    return this.props.firstName;
  }

  get lastName(): string | null {
    return this.props.lastName;
  }

  get phone(): string | null {
    return this.props.phone;
  }

  get avatar(): string | null {
    return this.props.avatar;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Méthodes métier
  updateProfile(data: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    avatar?: string | null;
  }): void {
    if (data.firstName !== undefined) {
      this.props.firstName = data.firstName;
    }
    if (data.lastName !== undefined) {
      this.props.lastName = data.lastName;
    }
    if (data.phone !== undefined) {
      this.props.phone = data.phone;
    }
    if (data.avatar !== undefined) {
      this.props.avatar = data.avatar;
    }
    this.props.updatedAt = new Date();
  }

  updateEmail(newEmail: string): void {
    this.props.email = new Email(newEmail);
    this.props.updatedAt = new Date();
  }

  changeRole(newRole: UserRole): void {
    this.props.role = newRole;
    this.props.updatedAt = new Date();
  }

  getFullName(): string | null {
    if (!this.props.firstName && !this.props.lastName) {
      return null;
    }
    return `${this.props.firstName || ''} ${this.props.lastName || ''}`.trim();
  }

  isPro(): boolean {
    return this.props.role === UserRole.PRO;
  }

  isClient(): boolean {
    return this.props.role === UserRole.CLIENT;
  }
}
