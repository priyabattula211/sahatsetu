import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { userRepository } from '../repositories/userRepository.js';
import { AppError } from '../utils/AppError.js';
import { signToken } from '../utils/jwt.js';

function normalizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileId: user.patient?.id || user.asha?.id || user.doctor?.id || null,
  };
}

function buildRoleProfile(role, body, defaults = {}) {
  if (role === Role.PATIENT) {
    return {
      patient: {
        create: {
          age: body.age,
          gender: body.gender,
          village: body.village,
          ...defaults,
        },
      },
    };
  }

  if (role === Role.ASHA) {
    return {
      asha: {
        create: {
          region: body.region,
          ...defaults,
        },
      },
    };
  }

  return {
    doctor: {
      create: {
        specialization: body.specialization,
        ...defaults,
      },
    },
  };
}

export const authService = {
  async signup(body) {
    const existingUser = await userRepository.findByEmail(body.email);
    if (existingUser) {
      throw new AppError('User already exists with this email', 409);
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await userRepository.createUser({
      fullName: body.fullName,
      email: body.email,
      passwordHash,
      role: body.role,
      ...buildRoleProfile(body.role, body),
    });

    const normalizedUser = normalizeUser(user);

    return {
      token: signToken(normalizedUser),
      user: normalizedUser,
    };
  },

  async login(body) {
    const user = await userRepository.findByEmail(body.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValidPassword = await bcrypt.compare(body.password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    const normalizedUser = normalizeUser(user);

    return {
      token: signToken(normalizedUser),
      user: normalizedUser,
    };
  },

  async me(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return normalizeUser(user);
  },
};
