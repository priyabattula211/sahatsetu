import { prisma } from '../lib/prisma.js';

export const appointmentRepository = {
  listDoctors() {
    return prisma.doctorProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  },

  createAppointment(data) {
    return prisma.appointment.create({
      data,
      include: { doctor: { include: { user: true } } },
    });
  },
};
