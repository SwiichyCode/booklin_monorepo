import { clerkMiddleware } from '@clerk/express';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../shared/types/errors';
import { UserRole, UserService } from '../modules/users';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const authenticate: RequestHandler = (req, res, next) => {
  return clerkMiddleware()(req, res, next);
};

const userService = new UserService();

export const loadUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth?.userId) throw new UnauthorizedError('Unauthorized');

    const user = await userService.getUserByClerkId(req.auth.userId);

    if (!user) throw new NotFoundError('User not found');

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};
