// Extend Express Request type

import type { $Enums } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: $Enums.UserRole };
      auth?: {
        userId: string;
        sessionId: string;
        // autres champs Clerk si besoin
      };
    }
  }
}
