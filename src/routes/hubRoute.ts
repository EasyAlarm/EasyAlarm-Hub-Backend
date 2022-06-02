import Router from 'express';
import { armHubHandler, disarmHubHandler, getHubSettingsHandler, getHubStatusHandler, panicHubHandler, updateHubSettingsHandler } from '../controllers/hubController';
import validateResource from '../middleware/validateResource';
import { armHubSchema } from '../schemas/hubSchema';
import { hubSettingsSchema } from '../schemas/hubSettingsSchema';

const router = Router();

router
    .route('/arm/:profileName')
    .post(validateResource(armHubSchema), armHubHandler);

router
    .route('/disarm')
    .post(disarmHubHandler);

router
    .route('/panic')
    .post(panicHubHandler);

router
    .route('/')
    .get(getHubStatusHandler);

router
    .route('/settings')
    .get(getHubSettingsHandler)
    .patch(validateResource(hubSettingsSchema), updateHubSettingsHandler);

export default router;