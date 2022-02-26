import Router from 'express';
import { createUnitSchema, getUnitSchema } from '../schemas/unitSchema';
import validateResource from '../middleware/validateResource';
import { addUnitHandler, getUnitHandler, getAllUnitsHandler, deleteUnitHandler, updateUnitHandler } from '../controllers/unitController';

const router = Router();

router
    .route('/')
    .get(getAllUnitsHandler)
    .post(validateResource(createUnitSchema), addUnitHandler);

router
    .route('/:unitID')
    .get(validateResource(getUnitSchema), getUnitHandler)
    .patch(validateResource(createUnitSchema), updateUnitHandler)
    .delete(validateResource(getUnitSchema), deleteUnitHandler);

export default router;