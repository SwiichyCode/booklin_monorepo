import { User, UserRole } from '../../domain/entities/User';

export interface UserFilter {
  id?: string;
  clerkId?: string;
  email?: string;
  role?: UserRole;
}

export interface UserRepository {
  create(user: User): Promise<User>;
  update(clerkId: string, user: User): Promise<User>;
  delete(clerkId: string): Promise<User>;
  findByClerkId(clerkId: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findMany(filter?: UserFilter): Promise<User[]>;
}
