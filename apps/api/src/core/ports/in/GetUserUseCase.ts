import { User } from '../../domain/entities/User';
import { UserFilter } from '../out/UserRepository';

export interface GetUserByIdQuery {
  id: string;
}

export interface GetUserByClerkIdQuery {
  clerkId: string;
}

export interface GetUserByEmailQuery {
  email: string;
}

export interface GetUsersQuery {
  filter?: UserFilter;
}

export interface GetUserUseCase {
  getById(query: GetUserByIdQuery): Promise<User | null>;
  getByClerkId(query: GetUserByClerkIdQuery): Promise<User | null>;
  getByEmail(query: GetUserByEmailQuery): Promise<User | null>;
  getMany(query: GetUsersQuery): Promise<User[]>;
}
