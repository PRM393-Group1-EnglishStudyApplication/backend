import type { UserDocument } from '../modules/auth/model.js';

// Mo rong Express Request de cac middleware/controller dung req.user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserDocument;
      clerkUserId?: string;
    }
  }
}

export {};
