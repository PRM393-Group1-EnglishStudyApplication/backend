import type { Request, Response, NextFunction } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { mapClerkUser, syncClerkUser, type ClerkUserLike } from '../modules/auth/auth.service.js';

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const auth = getAuth(req);

  if (!auth.userId) {
    throw ApiError.unauthorized('Ban can dang nhap de truy cap.');
  }

  const clerkUser = (await clerkClient.users.getUser(auth.userId)) as ClerkUserLike;
  const user = await syncClerkUser(mapClerkUser(clerkUser));

  req.clerkUserId = auth.userId;
  req.user = user;
  next();
});

export function requireRole(..._roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Ban can dang nhap.'));
    }
    next();
  };
}
