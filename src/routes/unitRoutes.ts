import Router from 'express';
import { createUnitSchema } from '../schema/unitSchema';
import validateResource from '../middleware/validateResource';
import { addUnitHandler, getUnitHandler, getAllUnitsHandler, deleteUnitHandler, updateUnitHandler } from '../controllers/unitController';

const router = Router();

router
    .route('/')
    .get(getAllUnitsHandler)
    .post(addUnitHandler);

router
    .route('/:unitID')
    .get(getUnitHandler)
    .patch(updateUnitHandler)
    .delete(deleteUnitHandler);

export default router;