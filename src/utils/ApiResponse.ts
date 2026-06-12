import type { Response } from 'express';

// Chuan hoa response tra ve cho Frontend (Flutter)
export function sendSuccess(
  res: Response,
  data: unknown = null,
  message = 'Success',
  statusCode = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  details: unknown = null
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}
