import 'reflect-metadata';
import { container } from 'tsyringe';
import { prismaClient } from '@/adapters/out/persistence/prisma/client';

// Repositories
import { UserRepository } from '@/core/ports/out/UserRepository';
import { PrismaUserRepository } from '@/adapters/out/persistence/prisma/repositories/PrismaUserRepository';
import { ProProfileRepository } from '@/core/ports/out/ProProfileRepository';
import { PrismaProProfileRepository } from '@/adapters/out/persistence/prisma/repositories/PrismaProProfileRepository';

// Use Cases
import { CreateUserUseCase } from '@/core/ports/in/CreateUserUseCase';
import { UpdateUserUseCase } from '@/core/ports/in/UpdateUserUseCase';
import { DeleteUserUseCase } from '@/core/ports/in/DeleteUserUseCase';
import { GetUserUseCase } from '@/core/ports/in/GetUserUseCase';
import { UserService } from '@/core/services/UserService';

// Controllers
import { UserController } from '@/adapters/in/http/controllers/UserController';
import { WebhookController } from '@/adapters/in/http/controllers/WebhookController';
import { ProProfileController } from '@/adapters/in/http/controllers/ProProfileController';

// Webhook Services
import { WebhookService } from '@/core/services/WebhookService';
import { ProcessWebhookUseCase } from '@/core/ports/in/ProcessWebhookUseCase';
import { VerifyWebhookUseCase } from '@/core/ports/in/VerifyWebhookUseCase';

// ProProfile Services
import { ProProfileService } from '@/core/services/ProProfileService';

export function setupContainer(): void {
  // Infrastructure - PrismaClient (singleton)
  // Utilise l'instance configurée depuis adapters/out/persistence/prisma/client.ts
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
    useFactory: c => {
      const service = c.resolve<UserService>('UserServiceInstance');
      return {
        execute: (command: any) => service.createUser(command),
      };
    },
  });

  container.register('UpdateUserUseCase', {
    useFactory: c => {
      const service = c.resolve<UserService>('UserServiceInstance');
      return {
        execute: (command: any) => service.updateUser(command),
      };
    },
  });

  container.register('DeleteUserUseCase', {
    useFactory: c => {
      const service = c.resolve<UserService>('UserServiceInstance');
      return {
        execute: (command: any) => service.deleteUser(command),
      };
    },
  });

  container.register('GetUserUseCase', {
    useFactory: c => c.resolve('UserServiceInstance'),
  });

  // Controllers (singleton)
  container.registerSingleton(UserController);

  // ========================================
  // WEBHOOK MODULE
  // ========================================

  // Webhook Services
  // UserService est utilisé par WebhookService, donc on l'enregistre comme 'UserService' aussi
  container.register('UserService', {
    useFactory: c => c.resolve('UserServiceInstance'),
  });

  // WebhookService singleton
  container.registerSingleton('WebhookServiceInstance', WebhookService);

  // Webhook Use Cases
  container.register('ProcessWebhookUseCase', {
    useFactory: c => {
      const service = c.resolve<WebhookService>('WebhookServiceInstance');
      return {
        execute: (command: any) => service.processWebhook(command),
      };
    },
  });

  container.register('VerifyWebhookUseCase', {
    useFactory: c => {
      const service = c.resolve<WebhookService>('WebhookServiceInstance');
      return {
        execute: (command: any) => service.verifyWebhook(command),
      };
    },
  });

  // Webhook Controller
  container.registerSingleton(WebhookController);

  // ========================================
  // PRO PROFILE MODULE
  // ========================================

  // ProProfile Repository
  container.register<ProProfileRepository>('ProProfileRepository', {
    useClass: PrismaProProfileRepository,
  });

  // ProProfileService singleton
  container.registerSingleton('ProProfileServiceInstance', ProProfileService);

  // ProProfile Use Cases
  container.register('CreateProProfileUseCase', {
    useFactory: (c) => {
      const service = c.resolve<ProProfileService>('ProProfileServiceInstance');
      return {
        execute: (command: any) => service.createProProfile(command),
      };
    },
  });

  container.register('UpdateProProfileUseCase', {
    useFactory: (c) => {
      const service = c.resolve<ProProfileService>('ProProfileServiceInstance');
      return {
        execute: (command: any) => service.updateProProfile(command),
      };
    },
  });

  container.register('DeleteProProfileUseCase', {
    useFactory: (c) => {
      const service = c.resolve<ProProfileService>('ProProfileServiceInstance');
      return {
        execute: (command: any) => service.deleteProProfile(command),
      };
    },
  });

  container.register('GetProProfileUseCase', {
    useFactory: (c) => c.resolve('ProProfileServiceInstance'),
  });

  container.register('ApproveProProfileUseCase', {
    useFactory: (c) => {
      const service = c.resolve<ProProfileService>('ProProfileServiceInstance');
      return {
        execute: (command: any) => service.approveProProfile(command),
      };
    },
  });

  container.register('RejectProProfileUseCase', {
    useFactory: (c) => {
      const service = c.resolve<ProProfileService>('ProProfileServiceInstance');
      return {
        execute: (command: any) => service.rejectProProfile(command),
      };
    },
  });

  container.register('ManagePremiumUseCase', {
    useFactory: (c) => {
      const service = c.resolve<ProProfileService>('ProProfileServiceInstance');
      return {
        activatePremium: (command: any) => service.activatePremium(command),
        renewPremium: (command: any) => service.renewPremium(command),
        deactivatePremium: (command: any) => service.deactivatePremium(command),
      };
    },
  });

  // ProProfile Controller
  container.registerSingleton(ProProfileController);
}

export { container };
