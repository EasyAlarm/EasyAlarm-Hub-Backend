import Router from 'express';
import { addRfidCardHandler } from '../controllers/rfidController';
import validateResource from '../middleware/validateResource';
import { addRfidCardSchema } from '../schemas/rfidSchema';

const router = Router();

router.post('/card', validateResource(addRfidCardSchema), addRfidCardHandler);

export default router;