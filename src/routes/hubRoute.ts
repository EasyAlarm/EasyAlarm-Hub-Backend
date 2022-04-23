import Router from 'express';
import { armHubHandler, disarmHubHandler, getHubStatusHandler, panicHubHandler } from '../controllers/hubController';
import validateResource from '../middleware/validateResource';
import { armHubSchema } from '../schemas/hubSchema';

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

export default router;