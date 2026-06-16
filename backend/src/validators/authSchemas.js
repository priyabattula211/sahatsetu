import { Role } from '@prisma/client';
import { z } from '../middleware/validate.js';

export const signupSchema = z.object({
  body: z
    .object({
      fullName: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(8),
      role: z.nativeEnum(Role),
      age: z.number().int().positive().optional(),
      gender: z.string().optional(),
      village: z.string().optional(),
      region: z.string().optional(),
      specialization: z.string().optional(),
    })
    .superRefine((value, ctx) => {
      if (value.role === Role.PATIENT && (!value.age || !value.gender || !value.village)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Patient signup requires age, gender, and village' });
      }
      if (value.role === Role.ASHA && !value.region) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ASHA signup requires region' });
      }
      if (value.role === Role.DOCTOR && !value.specialization) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Doctor signup requires specialization' });
      }
    }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
