// Extend Express Request type

import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      auth?: {
        userId: string;
        sessionId: string;
        // autres champs Clerk si besoin
      };
    }
  }
}
