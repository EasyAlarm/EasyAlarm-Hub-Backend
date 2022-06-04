import { Request, Response, NextFunction } from 'express';
import { CreateProfileInput, GetProfileInput, UpdateProfileInput } from '../schemas/profileSchema';
import { createProfile, getProfile, updateProfile } from '../services/profileService';
import { doUnitsExist } from '../services/unitService';
import ApiError from '../utils/apiError';
import catchAsync from '../utils/catchAsync';

export const addProfileHandler = catchAsync(async (req: Request<{}, {}, CreateProfileInput['body']>, res: Response, next: NextFunction) =>
{
    if (!await createProfile(req.body.name))
    {
        return next(new ApiError("Profile already exists", 400));
    }

    res.status(201).send("Profile added");
});

export const getProfileHanlder = catchAsync(async (req: Request<GetProfileInput['params']>, res: Response, next: NextFunction) =>
{
    const profile = await getProfile(req.params.name);

    if (!profile)
    {
        return next(new ApiError("Profile does not exist", 400));
    }

    res.status(200).send({ data: profile });
});

export const updateProfileHandler = catchAsync(async (req: Request<UpdateProfileInput['params'], {}, UpdateProfileInput['body']>, res: Response, next: NextFunction) =>
{

    console.log(req.body);

    const profile = await updateProfile(req.params.name, req.body.unitsIDS);


    if (!profile)
    {
        return next(new ApiError("Profile does not exist", 400));
    }

    res.status(200).send("Profile updated");
});
