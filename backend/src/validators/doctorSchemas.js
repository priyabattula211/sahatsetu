import { z } from '../middleware/validate.js';

export const prescriptionSchema = z.object({
  body: z.object({
    patientId: z.string().min(1),
    medication: z.string().min(2),
    dosage: z.string().min(2),
    notes: z.string().max(500).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const resolveEscalationSchema = z.object({
  body: z.object({
    resolvedNotes: z.string().min(3),
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});
