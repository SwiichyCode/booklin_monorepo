import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { ZodError } from 'zod';
import type { CreateUserUseCase } from '@/core/ports/in/CreateUserUseCase';
import type { UpdateUserUseCase } from '@/core/ports/in/UpdateUserUseCase';
import type { DeleteUserUseCase } from '@/core/ports/in/DeleteUserUseCase';
import type { GetUserUseCase } from '@/core/ports/in/GetUserUseCase';
import { DomainError } from '@/core/domain/errors/DomainError';
import {
  createUserSchema,
  updateUserSchema,
  clerkIdParamSchema,
  idParamSchema,
  emailParamSchema,
  getUsersQuerySchema,
} from '@/adapters/in/http/validation/user.validation';

@injectable()
export class UserController {
  constructor(
    @inject('CreateUserUseCase') private createUserUseCase: CreateUserUseCase,
    @inject('UpdateUserUseCase') private updateUserUseCase: UpdateUserUseCase,
    @inject('DeleteUserUseCase') private deleteUserUseCase: DeleteUserUseCase,
    @inject('GetUserUseCase') private getUserUseCase: GetUserUseCase
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      // Validation des données entrantes
      const validatedData = createUserSchema.parse(req.body);

      const user = await this.createUserUseCase.execute(validatedData);
      res.status(201).json({ success: true, data: this.toDTO(user) });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      // Validation des paramètres et du body
      const { clerkId } = clerkIdParamSchema.parse(req.params);
      const validatedData = updateUserSchema.parse(req.body);

      const user = await this.updateUserUseCase.execute({
        clerkId,
        ...validatedData,
      });
      res.status(200).json({ success: true, data: this.toDTO(user) });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      // Validation des paramètres
      const { clerkId } = clerkIdParamSchema.parse(req.params);

      const user = await this.deleteUserUseCase.execute({ clerkId });
      res.status(200).json({ success: true, data: this.toDTO(user) });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getUserByClerkId(req: Request, res: Response): Promise<void> {
    try {
      // Validation des paramètres
      const { clerkId } = clerkIdParamSchema.parse(req.params);

      const user = await this.getUserUseCase.getByClerkId({ clerkId });

      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      res.status(200).json({ success: true, data: this.toDTO(user) });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      // Validation des paramètres
      const { id } = idParamSchema.parse(req.params);

      const user = await this.getUserUseCase.getById({ id });

      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      res.status(200).json({ success: true, data: this.toDTO(user) });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      // Validation des paramètres
      const { email } = emailParamSchema.parse(req.params);

      const user = await this.getUserUseCase.getByEmail({ email });

      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      res.status(200).json({ success: true, data: this.toDTO(user) });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      // Validation des query params
      const validatedQuery = getUsersQuerySchema.parse(req.query);

      const users = await this.getUserUseCase.getMany({ filter: validatedQuery });
      res.status(200).json({
        success: true,
        data: users.map((user) => this.toDTO(user)),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // Mapper Domain -> DTO (pour exposer à l'API)
  private toDTO(user: any) {
    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email?.toString() ?? null,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private handleError(error: unknown, res: Response): void {
    // Gestion des erreurs de validation Zod
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      res.status(422).json({
        success: false,
        error: 'Validation failed',
        details: formattedErrors,
      });
      return;
    }

    // Gestion des erreurs du domaine
    if (error instanceof DomainError) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    // Gestion des erreurs génériques
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    // Erreur inconnue
    res.status(500).json({ success: false, error: 'Unknown error' });
  }
}
