import { doctorRepository } from '../repositories/doctorRepository.js';
import { AppError } from '../utils/AppError.js';

export const doctorService = {
  async getDashboard(userId) {
    const doctor = await doctorRepository.findDashboardByUserId(userId);
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    return doctor;
  },

  async addPrescription(userId, body) {
    const doctor = await doctorRepository.findDashboardByUserId(userId);
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    return doctorRepository.createPrescription({
      patientId: body.patientId,
      doctorId: doctor.id,
      medication: body.medication,
      dosage: body.dosage,
      notes: body.notes,
    });
  },

  async resolveEscalation(userId, escalationId, body) {
    const doctor = await doctorRepository.findDashboardByUserId(userId);
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    const escalation = doctor.escalations.find((item) => item.id === escalationId);
    if (!escalation) {
      throw new AppError('Escalation not found for this doctor', 404);
    }

    return doctorRepository.resolveEscalation(escalationId, body.resolvedNotes);
  },
};
