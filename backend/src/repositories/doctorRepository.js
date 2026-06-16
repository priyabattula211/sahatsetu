import { prisma } from '../lib/prisma.js';

export const doctorRepository = {
  findDashboardByUserId(userId) {
    return prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        escalations: {
          include: {
            patient: {
              include: {
                user: true,
                healthRecords: true,
                homeVisits: true,
                prescriptions: true,
                symptomChecks: true,
              },
            },
            ashaWorker: { include: { user: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        appointments: {
          include: { patient: { include: { user: true } } },
          orderBy: { scheduledAt: 'asc' },
        },
      },
    });
  },

  createPrescription(data) {
    return prisma.prescription.create({ data });
  },

  resolveEscalation(id, resolvedNotes) {
    return prisma.escalation.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedNotes,
      },
    });
  },
};
