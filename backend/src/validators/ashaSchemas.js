import { z } from '../middleware/validate.js';

export const visitSchema = z.object({
  body: z.object({
    patientId: z.string().min(1),
    visitDate: z.string().datetime(),
    notes: z.string().min(5),
    bloodPressure: z.string().min(3),
    heartRate: z.number().int().positive(),
    temperature: z.number().positive(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const escalationSchema = z.object({
  body: z.object({
    patientId: z.string().min(1),
    doctorUserId: z.string().min(1),
    reason: z.string().min(5),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
