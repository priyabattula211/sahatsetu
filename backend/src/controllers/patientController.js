import { patientService } from '../services/patientService.js';

export const patientController = {
  async getDashboard(req, res, next) {
    try {
      const dashboard = await patientService.getDashboard(req.user.id);
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  },

  async listDoctors(_req, res, next) {
    try {
      const doctors = await patientService.listDoctors();
      res.json(doctors);
    } catch (error) {
      next(error);
    }
  },

  async bookAppointment(req, res, next) {
    try {
      const appointment = await patientService.bookAppointment(req.user.id, req.validated.body);
      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  },

  async createSymptomCheck(req, res, next) {
    try {
      const symptomCheck = await patientService.createSymptomCheck(req.user.id, req.validated.body);
      res.status(201).json(symptomCheck);
    } catch (error) {
      next(error);
    }
  },
};
