import { User, UserRole } from '../../domain/entities/User';

export interface UserFilter {
  id?: string;
  email?: string;
  role?: UserRole;
}

export interface UserRepository {
  create(user: User): Promise<User>;
  update(id: string, user: User): Promise<User>;
  delete(id: string): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findMany(filter?: UserFilter): Promise<User[]>;
}
