/**
 * PrismaClient Configuration
 *
 * Configuration centralisée du client Prisma.
 * Cette configuration est utilisée par tous les repositories.
 *
 * Singleton pattern pour éviter d'ouvrir plusieurs connexions.
 */

import { PrismaClient } from '@prisma/client';
import { envConfig } from '../../../../shared/config/env';

const isDevelopment = envConfig.isDevelopment();

/**
 * Global variable pour stocker l'instance Prisma en développement
 * (évite la création de multiples instances lors du hot-reload)
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Configuration du client Prisma
 */
export const prismaClient =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: isDevelopment
      ? ['query', 'error', 'warn'] // Logs détaillés en dev
      : ['error'], // Logs minimaux en production
    errorFormat: isDevelopment ? 'pretty' : 'minimal',
  });

/**
 * En développement, stocker l'instance dans global pour éviter les reconnexions
 */
if (isDevelopment) {
  globalForPrisma.prisma = prismaClient;
}

/**
 * Graceful shutdown : fermer la connexion proprement
 */
export async function disconnectPrisma(): Promise<void> {
  await prismaClient.$disconnect();
}

/**
 * Health check de la base de données
 */
export async function isDatabaseConnected(): Promise<boolean> {
  try {
    await prismaClient.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('[Prisma] Database connection failed:', error);
    return false;
  }
}
