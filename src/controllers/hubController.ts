import { Request, Response, NextFunction } from 'express';
import { ArmHubInput } from '../schemas/hubSchema';
import { armHub, disarmHub, getHubStatus, panicHub } from '../services/hubService';
import { doesProfileExist } from '../services/profileService';
import { BaseHttpResponse } from '../utils/baseHttpResponse';
import catchAsync from "../utils/catchAsync";
import ProfileDoesNotExist from '../exceptions/api/profiles/profileDoesNotExist';

export const armHubHandler = catchAsync(async (req: Request<ArmHubInput['params']>, res: Response, next: NextFunction) =>
{
    if (!await doesProfileExist(req.params.profileName))
    {
        return next(new ProfileDoesNotExist());
    }

    armHub(req.params.profileName);

    const response = BaseHttpResponse.successMessageResponse("Hub armed");
    res.json(response);
});

export const disarmHubHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    disarmHub();

    const response = BaseHttpResponse.successMessageResponse("Hub disarmed");
    res.json(response);
});

export const panicHubHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    panicHub();

    const response = BaseHttpResponse.successMessageResponse("Hub panicked");
    res.json(response);
});

export const getHubStatusHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    const status = await getHubStatus();

    const response = BaseHttpResponse.successResponse(status);
    res.json(response);
});
