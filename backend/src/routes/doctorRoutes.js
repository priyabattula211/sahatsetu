import { Router } from 'express';
import { doctorController } from '../controllers/doctorController.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { prescriptionSchema, resolveEscalationSchema } from '../validators/doctorSchemas.js';

const router = Router();

router.use(authenticate, authorizeRoles('DOCTOR'));
router.get('/dashboard', doctorController.getDashboard);
router.post('/prescriptions', validate(prescriptionSchema), doctorController.addPrescription);
router.patch('/escalations/:id/resolve', validate(resolveEscalationSchema), doctorController.resolveEscalation);

export default router;
