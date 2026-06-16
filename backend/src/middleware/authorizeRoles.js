import { AppError } from '../utils/AppError.js';

export function authorizeRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }

    return next();
  };
}
