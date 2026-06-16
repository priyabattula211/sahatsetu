import { Router } from 'express';
import { patientController } from '../controllers/patientController.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { bookAppointmentSchema, symptomCheckSchema } from '../validators/patientSchemas.js';

const router = Router();

router.use(authenticate, authorizeRoles('PATIENT'));
router.get('/dashboard', patientController.getDashboard);
router.get('/doctors', patientController.listDoctors);
router.post('/appointments', validate(bookAppointmentSchema), patientController.bookAppointment);
router.post('/symptom-checker', validate(symptomCheckSchema), patientController.createSymptomCheck);

export default router;
