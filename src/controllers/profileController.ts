import { Request, Response, NextFunction } from 'express';
import { CreateProfileInput, GetProfileInput, UpdateProfileInput } from '../schemas/profileSchema';
import { createProfile, getProfile, updateProfile } from '../services/profileService';
import ApiError from '../utils/apiError';
import { BaseHttpResponse } from '../utils/baseHttpResponse';
import catchAsync from '../utils/catchAsync';

export const addProfileHandler = catchAsync(async (req: Request<{}, {}, CreateProfileInput['body']>, res: Response, next: NextFunction) =>
{
    const profile = await createProfile(req.body.name);

    if (!profile)
    {
        return next(new ApiError("Profile already exists", 400));
    }

    const response = BaseHttpResponse.successResponse(profile, 201);

    res.status(response.status).json(response);
});

export const getProfileHanlder = catchAsync(async (req: Request<GetProfileInput['params']>, res: Response, next: NextFunction) =>
{
    const profile = await getProfile(req.params.name);

    if (!profile)
    {
        return next(new ApiError("Profile does not exist", 400));
    }

    const response = BaseHttpResponse.successResponse(profile);
    res.json(response);
});

export const updateProfileHandler = catchAsync(async (req: Request<UpdateProfileInput['params'], {}, UpdateProfileInput['body']>, res: Response, next: NextFunction) =>
{
    const profile = await updateProfile(req.params.name, req.body.unitsIDS);

    if (!profile)
    {
        return next(new ApiError("Profile does not exist", 400));
    }

    const response = BaseHttpResponse.successResponse(profile);
    res.json(response);
});
