/**
 * Prisma Persistence Adapter
 *
 * Exporte tous les éléments nécessaires pour interagir avec Prisma.
 * Point d'entrée unique pour la couche de persistance Prisma.
 */

export { prismaClient, disconnectPrisma, isDatabaseConnected } from './client';
export { PrismaUserRepository } from './repositories/PrismaUserRepository';
export { UserMapper } from './mappers/UserMapper';
