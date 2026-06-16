import { AppointmentStatus } from '@prisma/client';
import { appointmentRepository } from '../repositories/appointmentRepository.js';
import { patientRepository } from '../repositories/patientRepository.js';
import { AppError } from '../utils/AppError.js';

export const patientService = {
  async getDashboard(userId) {
    const patient = await patientRepository.findDashboardByUserId(userId);
    if (!patient) {
      throw new AppError('Patient profile not found', 404);
    }

    return patient;
  },

  async listDoctors() {
    return appointmentRepository.listDoctors();
  },

  async bookAppointment(userId, body) {
    const patient = await patientRepository.findDashboardByUserId(userId);
    if (!patient) {
      throw new AppError('Patient profile not found', 404);
    }

    return appointmentRepository.createAppointment({
      patientId: patient.id,
      doctorId: body.doctorId,
      scheduledAt: new Date(body.scheduledAt),
      notes: body.notes,
      status: AppointmentStatus.BOOKED,
    });
  },

  async createSymptomCheck(userId, body) {
    const patient = await patientRepository.findDashboardByUserId(userId);
    if (!patient) {
      throw new AppError('Patient profile not found', 404);
    }

    return patientRepository.createSymptomCheck({
      patientId: patient.id,
      symptoms: body.symptoms,
      severity: body.severity,
      duration: body.duration,
    });
  },
};
