import { Request, Response, NextFunction } from 'express';
import { CreateUnitInput, DeleteUnitInput, GetUnitInput, UpdateUnitInput } from '../schemas/unitSchema';
import { createUnit, getUnit, getAllUnits, deleteUnit, updateUnit } from '../services/unitService';
import ApiError from '../utils/apiError';
import { BaseHttpResponse } from '../utils/baseHttpResponse';
import catchAsync from '../utils/catchAsync';

export const addUnitHandler = catchAsync(async (req: Request<{}, {}, CreateUnitInput['body']>, res: Response, next: NextFunction) =>
{

    if (await getUnit(req.body.deviceID))
    {
        return next(new ApiError("Unit already exists", 400));
    }

    const unit = await createUnit(req.body);

    if (!unit)
    {
        return next(new ApiError("Pairing failed or timed out", 400));
    }


    const response = BaseHttpResponse.successResponse(unit, 201, 'Unit added');
    return res.status(response.status).json(response);
});

export const getUnitHandler = catchAsync(async (req: Request<GetUnitInput['params']>, res: Response, next: NextFunction) =>
{
    const unit = await getUnit(req.params.deviceID);

    if (!unit)
    {
        return next(new ApiError("Unit does not exist", 400));
    }

    const response = BaseHttpResponse.successResponse(unit);
    return res.json(response);
});

export const getAllUnitsHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    const units = await getAllUnits();
    const response = BaseHttpResponse.successResponse(units);
    return res.json(response);
});

export const deleteUnitHandler = catchAsync(async (req: Request<DeleteUnitInput['params']>, res: Response, next: NextFunction) =>
{
    if (!await deleteUnit(req.params.deviceID))
    {
        return next(new ApiError('Unit not found', 400));
    }

    const response = BaseHttpResponse.successMessageResponse('Unit deleted');
    return res.json(response);
});

export const updateUnitHandler = catchAsync(async (req: Request<UpdateUnitInput['params'], {}, UpdateUnitInput['body']>, res: Response, next: NextFunction) =>
{
    const unit = await updateUnit(req.params.deviceID, req.body.friendlyName);

    if (!unit)
    {
        return next(new ApiError('Unit not found', 400));
    }

    const response = BaseHttpResponse.successResponse(unit);
    return res.json(response);
});