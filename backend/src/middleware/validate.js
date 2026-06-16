import { z } from 'zod';
import { AppError } from '../utils/AppError.js';

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(
        new AppError('Validation failed', 400, result.error.issues.map((issue) => issue.message)),
      );
    }

    req.validated = result.data;
    return next();
  };
}

export { z };
