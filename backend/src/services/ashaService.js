import { userRepository } from '../repositories/userRepository.js';
import { ashaRepository } from '../repositories/ashaRepository.js';
import { AppError } from '../utils/AppError.js';

export const ashaService = {
  async getDashboard(userId) {
    const asha = await ashaRepository.findDashboardByUserId(userId);
    if (!asha) {
      throw new AppError('ASHA profile not found', 404);
    }

    const doctors = await ashaRepository.listDoctors();

    return {
      ...asha,
      doctors,
    };
  },

  async logVisit(userId, body) {
    const asha = await ashaRepository.findDashboardByUserId(userId);
    if (!asha) {
      throw new AppError('ASHA profile not found', 404);
    }

    if (!asha.assignedPatients.some((patient) => patient.id === body.patientId)) {
      throw new AppError('Patient is not assigned to this ASHA worker', 403);
    }

    return ashaRepository.createHomeVisit({
      patientId: body.patientId,
      ashaWorkerId: asha.id,
      visitDate: new Date(body.visitDate),
      notes: body.notes,
      bloodPressure: body.bloodPressure,
      heartRate: body.heartRate,
      temperature: body.temperature,
    });
  },

  async createEscalation(userId, body) {
    const asha = await ashaRepository.findDashboardByUserId(userId);
    if (!asha) {
      throw new AppError('ASHA profile not found', 404);
    }

    if (!asha.assignedPatients.some((patient) => patient.id === body.patientId)) {
      throw new AppError('Patient is not assigned to this ASHA worker', 403);
    }

    const doctor = await userRepository.findById(body.doctorUserId);
    if (!doctor?.doctor) {
      throw new AppError('Doctor not found', 404);
    }

    return ashaRepository.createEscalation({
      patientId: body.patientId,
      ashaWorkerId: asha.id,
      doctorId: doctor.doctor.id,
      reason: body.reason,
    });
  },
};
