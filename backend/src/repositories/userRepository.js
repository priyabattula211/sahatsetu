import { prisma } from '../lib/prisma.js';

export const userRepository = {
  findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      include: { patient: true, asha: true, doctor: true },
    });
  },

  findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: { patient: true, asha: true, doctor: true },
    });
  },

  createUser(data) {
    return prisma.user.create({
      data,
      include: { patient: true, asha: true, doctor: true },
    });
  },
};
