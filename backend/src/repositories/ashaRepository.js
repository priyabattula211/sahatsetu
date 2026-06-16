import { prisma } from '../lib/prisma.js';

export const ashaRepository = {
  findDashboardByUserId(userId) {
    return prisma.ashaProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        assignedPatients: {
          include: {
            user: true,
            escalations: { where: { status: 'OPEN' } },
            appointments: { orderBy: { scheduledAt: 'asc' }, take: 1 },
          },
        },
        homeVisits: {
          include: { patient: { include: { user: true } } },
          orderBy: { visitDate: 'desc' },
        },
      },
    });
  },

  listDoctors() {
    return prisma.doctorProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  },

  createHomeVisit(data) {
    return prisma.homeVisit.create({
      data,
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  createEscalation(data) {
    return prisma.escalation.create({ data });
  },
};
