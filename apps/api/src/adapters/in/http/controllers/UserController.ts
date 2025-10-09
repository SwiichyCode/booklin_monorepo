import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import type { CreateUserUseCase } from '../../../../core/ports/in/CreateUserUseCase';
import type { UpdateUserUseCase } from '../../../../core/ports/in/UpdateUserUseCase';
import type { DeleteUserUseCase } from '../../../../core/ports/in/DeleteUserUseCase';
import type { GetUserUseCase } from '../../../../core/ports/in/GetUserUseCase';
import { DomainError } from '../../../../core/domain/errors/DomainError';

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
      const user = await this.createUserUseCase.execute(req.body);
      res.status(201).json({ success: true, data: this.toDTO(user) });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { clerkId } = req.params;
      const user = await this.updateUserUseCase.execute({
        clerkId,
        ...req.body,
      });
      res.status(200).json({ success: true, data: this.toDTO(user) });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { clerkId } = req.params;
      if (!clerkId) {
        res.status(400).json({ success: false, error: 'clerkId is required' });
        return;
      }
      const user = await this.deleteUserUseCase.execute({ clerkId });
      res.status(200).json({ success: true, data: this.toDTO(user) });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getUserByClerkId(req: Request, res: Response): Promise<void> {
    try {
      const { clerkId } = req.params;
      if (!clerkId) {
        res.status(400).json({ success: false, error: 'clerkId is required' });
        return;
      }
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
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: 'id is required' });
        return;
      }
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
      const { email } = req.params;
      if (!email) {
        res.status(400).json({ success: false, error: 'email is required' });
        return;
      }
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
      const users = await this.getUserUseCase.getMany({ filter: req.query });
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
    if (error instanceof DomainError) {
      res.status(400).json({ success: false, error: error.message });
    } else if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Unknown error' });
    }
  }
}
