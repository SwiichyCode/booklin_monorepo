import { prisma } from '../../lib/prisma';
import type { User } from '@prisma/client';
import type { CreateUserDTO, UpdateUserDTO, UserFilter } from './user.types';

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  update(clerkId: string, data: UpdateUserDTO): Promise<User>;
  delete(clerkId: string): Promise<User>;
  findByClerkId(clerkId: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findMany(filter?: UserFilter): Promise<User[]>;
}

export class UserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    return await prisma.user.create({ data });
  }

  async update(clerkId: string, data: UpdateUserDTO): Promise<User> {
    return await prisma.user.update({
      where: { clerkId },
      data,
    });
  }

  async delete(clerkId: string): Promise<User> {
    return await prisma.user.delete({
      where: { clerkId },
    });
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: { email },
    });
  }

  async findMany(filter?: UserFilter): Promise<User[]> {
    return await prisma.user.findMany({
      where: filter,
    });
  }
}
