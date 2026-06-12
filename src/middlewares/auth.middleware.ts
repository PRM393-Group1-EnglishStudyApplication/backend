import type { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import type { Role } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { findUserByClerkId } from '../modules/auth/auth.service.js';

// Bat buoc da dang nhap (co session Clerk hop le).
// clerkMiddleware() o app.js da gan thong tin auth vao req.
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const auth = getAuth(req);

  if (!auth?.userId) {
    throw ApiError.unauthorized('Ban can dang nhap de truy cap.');
  }

  // Map Clerk user -> User trong DB (tao moi neu chua co - JIT provisioning)
  const user = await findUserByClerkId(auth.userId);
  if (!user) {
    throw ApiError.unauthorized('Tai khoan chua duoc dong bo. Vui long thu lai.');
  }

  // Gan vao req de cac controller sau dung
  req.clerkUserId = auth.userId;
  req.user = user;
  next();
});

// Phan quyen theo Role (vd: chi ADMIN moi CRUD course - WBS 3.0)
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Ban can dang nhap.'));
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Ban khong co quyen thuc hien hanh dong nay.'));
    }
    next();
  };
}
