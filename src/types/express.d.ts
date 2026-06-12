import type { User } from '@prisma/client';

// Mo rong Express Request de cac middleware/controller dung req.user, req.clerkUserId
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
      clerkUserId?: string;
    }
  }
}

export {};
