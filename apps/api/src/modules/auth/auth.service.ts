// apps/api/src/modules/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UnauthorizedError } from '../../shared/types/errors';
import { AuthRepository } from './auth.repository';
import { AuthUser, LoginDTO, RegisterDTO, Tokens } from './auth.types';

export class AuthService {
  constructor(private repo: AuthRepository) {}

  private signTokens(payload: { userId: string; email: string; role?: string }): Tokens {
    const accessToken = jwt.sign(
      payload,
      env.JWT_SECRET as jwt.Secret,
      { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions,
    );
    const refreshToken = jwt.sign(
      payload,
      env.JWT_REFRESH_SECRET as jwt.Secret,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      } as jwt.SignOptions,
    );
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDTO): Promise<{ user: Omit<AuthUser, 'passwordHash'>; tokens: Tokens }> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) throw new UnauthorizedError('Email already in use');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.repo.create({ email: dto.email, passwordHash, role: dto.role });
    const tokens = this.signTokens({ userId: user.id, email: user.email, role: user.role });
    const { passwordHash: _, ...safe } = user;
    return { user: safe, tokens };
  }

  async login(dto: LoginDTO): Promise<{ user: Omit<AuthUser, 'passwordHash'>; tokens: Tokens }> {
    const user = await this.repo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedError('Invalid credentials');
    const tokens = this.signTokens({ userId: user.id, email: user.email, role: user.role });
    const { passwordHash: _, ...safe } = user;
    return { user: safe, tokens };
  }

  async me(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  refresh(token: string): Tokens {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET as jwt.Secret) as unknown as {
      userId: string;
      email: string;
      role?: string;
    };
    return this.signTokens({ userId: decoded.userId, email: decoded.email, role: decoded.role });
  }
}
