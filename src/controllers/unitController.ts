import { Request, Response, NextFunction } from 'express';
import { CreateUnitInput, DeleteUnitInput, GetUnitInput, UpdateUnitInput } from '../schemas/unitSchema';
import { createUnit, getUnit, getAllUnits, deleteUnit, updateUnit } from '../services/unitService';
import ApiError from '../utils/apiError';
import catchAsync from '../utils/catchAsync';

export const addUnitHandler = catchAsync(async (req: Request<{}, {}, CreateUnitInput['body']>, res: Response, next: NextFunction) =>
{

    if (await getUnit(req.body.unitID))
    {
        return next(new ApiError("Unit already exists", 400));
    }

    await createUnit(req.body);

    //pairing code


    return res.status(201).send('Under construction');
});

export const getUnitHandler = catchAsync(async (req: Request<{}, {}, GetUnitInput['body']>, res: Response, next: NextFunction) =>
{
    const unit = await getUnit(req.body.unitID);

    if (!unit)
    {
        return next(new ApiError("Unit does not exist", 400));
    }

    return res.status(200).send({ data: unit });
});

export const getAllUnitsHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    const units = await getAllUnits();
    return res.status(200).send({ data: units });
});

export const deleteUnitHandler = catchAsync(async (req: Request<{}, {}, DeleteUnitInput['body']>, res: Response, next: NextFunction) =>
{
    if (!await deleteUnit(req.body.unitID))
    {
        return next(new ApiError('Unit not found', 400));
    }

    return res.status(200).send('Unit deleted');
});

export const updateUnitHandler = catchAsync(async (req: Request<{}, {}, UpdateUnitInput['body']>, res: Response, next: NextFunction) =>
{
    if (!await updateUnit(req.body.unitID, req.body.friendlyName))
    {
        return next(new ApiError('Unit not found', 400));
    }

    return res.status(200).send('Unit updated');
});