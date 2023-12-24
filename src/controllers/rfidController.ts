import { Request, Response, NextFunction } from "express";
import { AddRfidCardInput } from "../schemas/rfidSchema";
import { addRfidCard } from "../services/rfidService";
import catchAsync from "../utils/catchAsync";
import { BaseHttpResponse } from "../utils/baseHttpResponse";

export const addRfidCardHandler = catchAsync(async (req: Request<{}, {}, AddRfidCardInput['body']>, res: Response, next: NextFunction) =>
{
    const rfidCard = await addRfidCard(req.body);

    return BaseHttpResponse.successResponse(rfidCard);
});