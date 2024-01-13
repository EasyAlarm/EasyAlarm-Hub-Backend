import { Request, Response, NextFunction } from 'express';
import { CreateProfileInput, GetProfileInput, getProfileSchema, UpdateProfileInput } from '../schemas/profileSchema';
import { createProfile, doesProfileExist, getProfile, getProfiles, updateProfile } from '../services/profileService';
import { BaseHttpResponse } from '../utils/baseHttpResponse';
import catchAsync from '../utils/catchAsync';
import ProfileAlreadyExistsError from '../exceptions/api/profiles/profileAlreadyExists';
import ProfileDoesNotExist from '../exceptions/api/profiles/profileDoesNotExist';

export const addProfileHandler = catchAsync(async (req: Request<{}, {}, CreateProfileInput['body']>, res: Response, next: NextFunction) =>
{
    if (await doesProfileExist(req.body.name))
    {
        return next(new ProfileAlreadyExistsError());
    }

    const profile = await createProfile(req.body.name);

    const response = BaseHttpResponse.successResponse(profile, 201);

    res.status(response.status).json(response);
});

export const getProfilesHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => 
{
    const profiles = await getProfiles();

    const response = BaseHttpResponse.successResponse(profiles, 200);
    res.status(response.status).json(response);
});

export const getProfileHanlder = catchAsync(async (req: Request<GetProfileInput['params']>, res: Response, next: NextFunction) =>
{
    const profile = await getProfile(req.params.name);

    if (!profile)
    {
        return next(new ProfileDoesNotExist());
    }

    const response = BaseHttpResponse.successResponse(profile);
    res.json(response);
});

export const updateProfileHandler = catchAsync(async (req: Request<UpdateProfileInput['params'], {}, UpdateProfileInput['body']>, res: Response, next: NextFunction) =>
{
    const profile = await updateProfile(req.params.name, req.body.unitsIDS);

    if (!profile)
    {
        return next(new ProfileDoesNotExist());
    }

    const response = BaseHttpResponse.successResponse(profile);
    res.json(response);
});
