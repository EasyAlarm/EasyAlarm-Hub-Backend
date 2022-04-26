import Router from 'express';
import { createUnitSchema, deleteUnitSchema, getUnitSchema, updateUnitSchema } from '../schemas/unitSchema';
import validateResource from '../middleware/validateResource';
import { addUnitHandler, getUnitHandler, getAllUnitsHandler, deleteUnitHandler, updateUnitHandler } from '../controllers/unitController';

const router = Router();

router
    .route('/')
    .get(getAllUnitsHandler)
    .post(validateResource(createUnitSchema), addUnitHandler);

router
    .route('/:deviceID')
    .get(validateResource(getUnitSchema), getUnitHandler)
    .patch(validateResource(updateUnitSchema), updateUnitHandler)
    .delete(validateResource(deleteUnitSchema), deleteUnitHandler);

export default router;