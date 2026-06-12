import type { Request, Response, NextFunction } from 'express';
import type { ZodTypeAny } from 'zod';

type ValidateSource = 'body' | 'query' | 'params';

// Middleware validate body/query/params bang Zod schema
export function validate(schema: ZodTypeAny, source: ValidateSource = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(result.error); // errorHandler se xu ly ZodError
    }
    // du lieu da duoc parse/chuan hoa
    (req as unknown as Record<ValidateSource, unknown>)[source] = result.data;
    next();
  };
}
