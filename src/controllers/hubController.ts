import { Request, Response, NextFunction } from 'express';
import IHubSettings from '../hub/IHubSettings';
import { ArmHubInput } from '../schemas/hubSchema';
import { UpdateHubSettingsSchema } from '../schemas/hubSettingsSchema';
import { armHub, disarmHub, getHubSettings, getHubStatus, panicHub, updateHubSettings } from '../services/hubService';
import { doesProfileExist } from '../services/profileService';
import ApiError from '../utils/apiError';
import catchAsync from "../utils/catchAsync";

export const armHubHandler = catchAsync(async (req: Request<ArmHubInput['params']>, res: Response, next: NextFunction) =>
{
    if (!await doesProfileExist(req.params.profileName))
    {
        return next(new ApiError("Profile does not exist", 400));
    }


    armHub(req.params.profileName);

    res.status(200).send("Hub armed");
});

export const disarmHubHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    disarmHub();
    res.status(200).send("Hub disarmed");
});

export const panicHubHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    panicHub();
    res.status(200).send("Hub panicked");
});

export const getHubStatusHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    const status = await getHubStatus();
    res.status(200).send({ data: status });
});

export const getHubSettingsHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    const settings = await getHubSettings();
    res.status(200).send({ data: settings });
});

export const updateHubSettingsHandler = catchAsync(async (req: Request<{}, {}, UpdateHubSettingsSchema['body']>, res: Response, next: NextFunction) =>
{
    const hubSettings: IHubSettings =
    {
        //convert to int 
        armDelay: parseInt(req.body.armDelay),
        alarmDuration: parseInt(req.body.alarmDuration),
        alarmDelay: parseInt(req.body.alarmDelay),
        alarmOnOfflineUnit: false
    };
    
    console.log(hubSettings);

    await updateHubSettings(hubSettings);

    res.status(200).send("Hub settings updated");
});