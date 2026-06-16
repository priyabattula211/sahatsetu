import { doctorService } from '../services/doctorService.js';

export const doctorController = {
  async getDashboard(req, res, next) {
    try {
      const dashboard = await doctorService.getDashboard(req.user.id);
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  },

  async addPrescription(req, res, next) {
    try {
      const prescription = await doctorService.addPrescription(req.user.id, req.validated.body);
      res.status(201).json(prescription);
    } catch (error) {
      next(error);
    }
  },

  async resolveEscalation(req, res, next) {
    try {
      const escalation = await doctorService.resolveEscalation(
        req.user.id,
        req.params.id,
        req.validated.body,
      );
      res.json(escalation);
    } catch (error) {
      next(error);
    }
  },
};
