import { Request, Response, NextFunction } from 'express';
import { clerkMiddleware } from '@clerk/express';
import type { RequestHandler } from 'express';
import { InternalServerError, NotFoundError, UnauthorizedError } from '../shared/types/errors';
import { prisma } from '../lib/prisma';

export const authenticate: RequestHandler = (req, res, next) => {
  return clerkMiddleware()(req, res, next);
};

export const loadUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth?.userId) throw new UnauthorizedError('Unauthorized');

    const user = await prisma.user.findUnique({ where: { id: req.auth.userId } });

    if (!user) throw new NotFoundError('User not found');

    req.user = user;
    next();
  } catch (error) {
    next(error);
    throw new InternalServerError('Internal server error');
  }
};
