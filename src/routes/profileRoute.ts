import Router from 'express';
import { addProfileHandler, getProfileHanlder, getProfilesHandler, updateProfileHandler } from '../controllers/profileController';
import validateResource from '../middleware/validateResource';
import { createProfileSchema, getProfileSchema, updateProfileSchema } from '../schemas/profileSchema';

const router = Router();

router
    .route('/')
    .post(validateResource(createProfileSchema), addProfileHandler)
    .get(getProfilesHandler);

router
    .route('/:name')
    .get(validateResource(getProfileSchema), getProfileHanlder)
    .patch(validateResource(updateProfileSchema), updateProfileHandler);

export default router;