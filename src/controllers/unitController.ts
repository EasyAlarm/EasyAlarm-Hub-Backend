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

    if (!await createUnit(req.body))
    {
        return next(new ApiError("Pairing failed or timed out", 400));
    }


    return res.status(201).send('Unit added');
});

export const getUnitHandler = catchAsync(async (req: Request<GetUnitInput['params']>, res: Response, next: NextFunction) =>
{
    const unit = await getUnit(req.params.unitID);

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

export const deleteUnitHandler = catchAsync(async (req: Request<DeleteUnitInput['params']>, res: Response, next: NextFunction) =>
{
    if (!await deleteUnit(req.params.unitID))
    {
        return next(new ApiError('Unit not found', 400));
    }

    return res.status(200).send('Unit deleted');
});

export const updateUnitHandler = catchAsync(async (req: Request<UpdateUnitInput['params'], {}, UpdateUnitInput['body']>, res: Response, next: NextFunction) =>
{
    if (!await updateUnit(req.params.unitID, req.body.friendlyName))
    {
        return next(new ApiError('Unit not found', 400));
    }

    return res.status(200).send('Unit updated');
});