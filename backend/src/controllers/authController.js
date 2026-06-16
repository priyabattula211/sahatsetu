import { authService } from '../services/authService.js';

export const authController = {
  async signup(req, res, next) {
    try {
      const result = await authService.signup(req.validated.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.validated.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async me(req, res, next) {
    try {
      const user = await authService.me(req.user.id);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },
};
