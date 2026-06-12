import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';
import { sendError } from '../utils/ApiResponse.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

// 404 - route khong ton tai
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route khong ton tai: ${req.method} ${req.originalUrl}`));
}

// Error handler tap trung - phai co du 4 tham so de Express nhan dien
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response {
  const e = err as { statusCode?: number; message?: string; details?: unknown; stack?: string };

  let statusCode = e.statusCode || 500;
  let message = e.message || 'Internal Server Error';
  let details: unknown = e.details ?? null;

  // Loi validate cua Zod
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Du lieu khong hop le';
    details = err.errors.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }

  // Loi trung unique cua Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    statusCode = 409;
    message = `Gia tri da ton tai: ${err.meta?.target}`;
  }

  if (statusCode >= 500) {
    logger.error(e.stack || message);
  } else {
    logger.warn(`${statusCode} - ${message}`);
  }

  // Khong lo stack ra ngoai o production
  const payload = !env.isProd && statusCode >= 500 ? { stack: e.stack } : details;
  return sendError(res, statusCode, message, payload);
}
