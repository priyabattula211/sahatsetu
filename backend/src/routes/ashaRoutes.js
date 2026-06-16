import { Router } from 'express';
import { ashaController } from '../controllers/ashaController.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { escalationSchema, visitSchema } from '../validators/ashaSchemas.js';

const router = Router();

router.use(authenticate, authorizeRoles('ASHA'));
router.get('/dashboard', ashaController.getDashboard);
router.post('/visits', validate(visitSchema), ashaController.logVisit);
router.post('/escalations', validate(escalationSchema), ashaController.createEscalation);

export default router;
