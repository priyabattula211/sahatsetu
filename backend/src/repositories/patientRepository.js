import { prisma } from '../lib/prisma.js';

export const patientRepository = {
  findDashboardByUserId(userId) {
    return prisma.patientProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        ashaWorker: { include: { user: true } },
        appointments: { include: { doctor: { include: { user: true } } }, orderBy: { scheduledAt: 'asc' } },
        healthRecords: { orderBy: { createdAt: 'desc' } },
        prescriptions: { include: { doctor: { include: { user: true } } }, orderBy: { createdAt: 'desc' } },
        symptomChecks: { orderBy: { createdAt: 'desc' } },
      },
    });
  },

  createSymptomCheck(data) {
    return prisma.symptomCheck.create({ data });
  },
};
