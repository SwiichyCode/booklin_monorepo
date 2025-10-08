// Extend Express Request type

import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
      };
      user?: User;
    }
  }
}
