import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';

// Repositories
import { UserRepository } from '../../core/ports/out/UserRepository';
import { PrismaUserRepository } from '../../adapters/out/persistence/prisma/repositories/PrismaUserRepository';

// Use Cases
import { CreateUserUseCase } from '../../core/ports/in/CreateUserUseCase';
import { UpdateUserUseCase } from '../../core/ports/in/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../core/ports/in/DeleteUserUseCase';
import { GetUserUseCase } from '../../core/ports/in/GetUserUseCase';
import { UserService } from '../../core/services/UserService';

// Controllers
import { UserController } from '../../adapters/in/http/controllers/UserController';
import { WebhookController } from '../../adapters/in/http/controllers/WebhookController';

// Webhook Services
import { WebhookService } from '../../core/services/WebhookService';
import { ProcessWebhookUseCase } from '../../core/ports/in/ProcessWebhookUseCase';
import { VerifyWebhookUseCase } from '../../core/ports/in/VerifyWebhookUseCase';

export function setupContainer(): void {
  // Infrastructure - PrismaClient (singleton)
  const prismaClient = new PrismaClient();
  container.register('PrismaClient', {
    useValue: prismaClient,
  });

  // Repositories (singleton pour réutilisation connexion DB)
  container.register<UserRepository>('UserRepository', {
    useClass: PrismaUserRepository,
  });

  // Use Cases - Tous pointent vers UserService
  // (singleton pour éviter de créer plusieurs instances)
  container.registerSingleton('UserServiceInstance', UserService);

  // Enregistrer les use cases en pointant vers la même instance
  container.register('CreateUserUseCase', {
    useFactory: (c) => {
      const service = c.resolve<UserService>('UserServiceInstance');
      return {
        execute: (command: any) => service.createUser(command),
      };
    },
  });

  container.register('UpdateUserUseCase', {
    useFactory: (c) => {
      const service = c.resolve<UserService>('UserServiceInstance');
      return {
        execute: (command: any) => service.updateUser(command),
      };
    },
  });

  container.register('DeleteUserUseCase', {
    useFactory: (c) => {
      const service = c.resolve<UserService>('UserServiceInstance');
      return {
        execute: (command: any) => service.deleteUser(command),
      };
    },
  });

  container.register('GetUserUseCase', {
    useFactory: (c) => c.resolve('UserServiceInstance'),
  });

  // Controllers (singleton)
  container.registerSingleton(UserController);

  // ========================================
  // WEBHOOK MODULE
  // ========================================

  // Webhook Services
  // UserService est utilisé par WebhookService, donc on l'enregistre comme 'UserService' aussi
  container.register('UserService', {
    useFactory: (c) => c.resolve('UserServiceInstance'),
  });

  // WebhookService singleton
  container.registerSingleton('WebhookServiceInstance', WebhookService);

  // Webhook Use Cases
  container.register('ProcessWebhookUseCase', {
    useFactory: (c) => {
      const service = c.resolve<WebhookService>('WebhookServiceInstance');
      return {
        execute: (command: any) => service.processWebhook(command),
      };
    },
  });

  container.register('VerifyWebhookUseCase', {
    useFactory: (c) => {
      const service = c.resolve<WebhookService>('WebhookServiceInstance');
      return {
        execute: (command: any) => service.verifyWebhook(command),
      };
    },
  });

  // Webhook Controller
  container.registerSingleton(WebhookController);
}

export { container };
