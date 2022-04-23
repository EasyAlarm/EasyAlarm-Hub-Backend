import { Request, Response, NextFunction } from 'express';
import { ArmHubInput } from '../schemas/hubSchema';
import { armHub, disarmHub, getHubStatus, panicHub } from '../services/hubService';
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