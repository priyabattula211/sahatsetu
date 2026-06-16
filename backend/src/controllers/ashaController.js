import { ashaService } from '../services/ashaService.js';

export const ashaController = {
  async getDashboard(req, res, next) {
    try {
      const dashboard = await ashaService.getDashboard(req.user.id);
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  },

  async logVisit(req, res, next) {
    try {
      const visit = await ashaService.logVisit(req.user.id, req.validated.body);
      res.status(201).json(visit);
    } catch (error) {
      next(error);
    }
  },

  async createEscalation(req, res, next) {
    try {
      const escalation = await ashaService.createEscalation(req.user.id, req.validated.body);
      res.status(201).json(escalation);
    } catch (error) {
      next(error);
    }
  },
};
