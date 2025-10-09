import { User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client';
import { User, UserRole } from '@/core/domain/entities/User';
import { Email } from '@/core/domain/value-objects/Email';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.fromPersistence({
      id: prismaUser.id,
      clerkId: prismaUser.clerkId,
      email: prismaUser.email ? new Email(prismaUser.email) : null,
      role: this.mapRole(prismaUser.role),
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      phone: prismaUser.phone,
      avatar: prismaUser.avatar,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  static toPersistence(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email?.toString() ?? null,
      role: this.mapRoleToPrisma(user.role),
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
    };
  }

  static toCreateData(user: User) {
    return {
      clerkId: user.clerkId,
      email: user.email?.toString() ?? null,
      role: this.mapRoleToPrisma(user.role),
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
    };
  }

  static toUpdateData(user: User) {
    return {
      email: user.email?.toString() ?? null,
      role: this.mapRoleToPrisma(user.role),
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
    };
  }

  private static mapRole(prismaRole: PrismaUserRole): UserRole {
    return prismaRole === 'CLIENT' ? UserRole.CLIENT : UserRole.PRO;
  }

  private static mapRoleToPrisma(role: UserRole): PrismaUserRole {
    return role === UserRole.CLIENT ? 'CLIENT' : 'PRO';
  }
}
