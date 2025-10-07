// apps/api/src/modules/auth/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { loginSchema, registerSchema } from './auth.types';
import { UnauthorizedError } from '../../shared/types/errors';

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (req: Request, res: Response) => {
    const dto = registerSchema.parse(req.body);
    const result = await this.service.register(dto);
    res.status(201).json(result);
  };

  login = async (req: Request, res: Response) => {
    const dto = loginSchema.parse(req.body);
    const result = await this.service.login(dto);
    res.json(result);
  };

  me = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError('Not authenticated');
    const result = await this.service.me(req.user.userId);
    res.json(result);
  };

  refresh = async (req: Request, res: Response) => {
    const token = (req.body?.refreshToken || req.headers['x-refresh-token']) as string | undefined;
    if (!token) throw new UnauthorizedError('Refresh token required');
    const tokens = this.service.refresh(token);
    res.json(tokens);
  };

  logout = async (_req: Request, res: Response) => {
    // Si vous gérez des refresh tokens persistés, révoquez-les ici
    res.status(204).end();
  };
}
