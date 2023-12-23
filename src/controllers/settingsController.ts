import { Request, Response, NextFunction } from 'express';
import { AlarmSettingsDocument } from '../models/alarmSettingsModel';
import { PingerSettingsDocument } from '../models/pingerSettingsModel';
import { UpdateAlarmSettingsSchema } from '../schemas/alarmSettingsSchema';
import { UpdatePingerSettingsSchema } from '../schemas/pingerSettingsSchema';
import { getAlarmSettings, getPingerSettings, updateAlarmSettings, updatePingerSettings } from '../services/settingsService';
import { BaseHttpResponse } from '../utils/baseHttpResponse';
import catchAsync from '../utils/catchAsync';

export const getAlarmSettingsHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    const alarmSettings = await getAlarmSettings();

    const response = BaseHttpResponse.successResponse(alarmSettings);
    return res.json(response);
});

export const updateAlarmSettingsHandler = catchAsync(async (req: Request<{}, {}, UpdateAlarmSettingsSchema['body']>, res: Response, next: NextFunction) =>
{
    const updatedAlarmSettings = await updateAlarmSettings(req.body as AlarmSettingsDocument);

    const response = BaseHttpResponse.successResponse(updatedAlarmSettings);
    res.json(response);
});


export const getPingerSettingsHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    const pingerSettings = await getPingerSettings();

    const response = BaseHttpResponse.successResponse(pingerSettings);
    return res.json(response);
});


export const updatePingerSettingsHandler = catchAsync(async (req: Request<{}, {}, UpdatePingerSettingsSchema['body']>, res: Response, next: NextFunction) =>
{
    const updatedPingerSettings = await updatePingerSettings(req.body as PingerSettingsDocument);

    const response = BaseHttpResponse.successResponse(updatedPingerSettings);
    res.json(response);
});



