import Router from 'express';
import { getAlarmSettingsHandler, getPingerSettingsHandler, updateAlarmSettingsHandler, updatePingerSettingsHandler } from '../controllers/settingsController';
import validateResource from '../middleware/validateResource';
import { updateAlarmSettingsSchema } from '../schemas/alarmSettingsSchema';
import { updatePingerSettingsSchema } from '../schemas/pingerSettingsSchema';

const router = Router();

router
    .route('/alarm')
    .get(getAlarmSettingsHandler)
    .patch(validateResource(updateAlarmSettingsSchema), updateAlarmSettingsHandler);

router
    .route('/pinger')
    .get(getPingerSettingsHandler)
    .patch(validateResource(updatePingerSettingsSchema), updatePingerSettingsHandler);

export default router;