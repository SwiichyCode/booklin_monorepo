import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { UserRepository, UserFilter } from '@/core/ports/out/UserRepository';
import { User } from '@/core/domain/entities/User';
import { UserMapper } from '@/adapters/out/persistence/prisma/mappers/UserMapper';

@injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const data = UserMapper.toCreateData(user);
    const created = await this.prisma.user.create({ data });
    return UserMapper.toDomain(created);
  }

  async update(id: string, user: User): Promise<User> {
    const data = UserMapper.toUpdateData(user);
    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });
    return UserMapper.toDomain(updated);
  }

  async delete(id: string): Promise<User> {
    const deleted = await this.prisma.user.delete({
      where: { id },
    });
    return UserMapper.toDomain(deleted);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findMany(filter?: UserFilter): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: filter
        ? {
            id: filter.id,
            email: filter.email?.toLowerCase(),
            role: filter.role,
          }
        : undefined,
    });
    return users.map(user => UserMapper.toDomain(user));
  }
}
