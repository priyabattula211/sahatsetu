import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';

export function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
}
