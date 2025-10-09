import type { User } from '@prisma/client';
import type { IUserRepository } from './user.repository';
import { UserRepository } from './user.repository';
import type { CreateUserDTO, UpdateUserDTO, UserFilter } from './user.types';

export interface IUserService {
  createUser(data: CreateUserDTO): Promise<User>;
  updateUser(clerkId: string, data: UpdateUserDTO): Promise<User>;
  deleteUser(clerkId: string): Promise<User>;
  getUserByClerkId(clerkId: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUsers(filter?: UserFilter): Promise<User[]>;
}

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository = new UserRepository()) {}

  async createUser(data: CreateUserDTO): Promise<User> {
    const normalizedData = {
      ...data,
      email: data.email?.toLowerCase() || null,
    };

    return await this.userRepository.create(normalizedData);
  }

  async updateUser(clerkId: string, data: UpdateUserDTO): Promise<User> {
    const normalizedData = {
      ...data,
      email: data.email ? data.email.toLowerCase() : undefined,
    };

    return await this.userRepository.update(clerkId, normalizedData);
  }

  async deleteUser(clerkId: string): Promise<User> {
    return await this.userRepository.delete(clerkId);
  }

  async getUserByClerkId(clerkId: string): Promise<User | null> {
    return await this.userRepository.findByClerkId(clerkId);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email.toLowerCase());
  }

  async getUsers(filter?: UserFilter): Promise<User[]> {
    const normalizedFilter = filter?.email ? { ...filter, email: filter.email.toLowerCase() } : filter;

    return await this.userRepository.findMany(normalizedFilter);
  }
}
