import { z } from '../middleware/validate.js';

export const bookAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().min(1),
    scheduledAt: z.string().datetime(),
    notes: z.string().min(3).max(500).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const symptomCheckSchema = z.object({
  body: z.object({
    symptoms: z.string().min(5),
    severity: z.string().min(3),
    duration: z.string().min(2),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
