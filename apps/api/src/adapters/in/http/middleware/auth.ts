import { injectable } from 'tsyringe';
import { UserService } from '@/core/services/UserService';
import { UnauthorizedError, ForbiddenError } from '@/shared/types/errors';
import { getAuth } from '@clerk/express';
import { $Enums } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

type UserRole = $Enums.UserRole;

export function RequireAuthMiddleware() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { isAuthenticated, userId } = getAuth(req);
      if (!isAuthenticated || !userId) return next(new UnauthorizedError('User not authenticated'));

      return next();
    } catch (err) {
      next(new UnauthorizedError('Authentication failed'));
    }
  };
}

@injectable()
export class RequireRolesMiddleware {
  constructor(private userService: UserService) {}

  handle(...allowedRoles: UserRole[]) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      try {
        const { isAuthenticated, userId } = getAuth(req);
        if (!isAuthenticated || !userId) return next(new UnauthorizedError('User not authenticated'));

        const user = await this.userService.getByClerkId({ clerkId: userId });
        if (!user) return next(new UnauthorizedError('User not found'));

        if (!allowedRoles.includes(user.role)) return next(new ForbiddenError('Access denied'));

        return next();
      } catch (err) {
        next(new UnauthorizedError('Authentication failed'));
      }
    };
  }
}
