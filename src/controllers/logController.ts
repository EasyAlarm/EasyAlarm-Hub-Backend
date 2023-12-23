import { Request, Response, NextFunction } from 'express';
import { getAllLogs } from "../services/logService";
import { BaseHttpResponse } from '../utils/baseHttpResponse';
import catchAsync from "../utils/catchAsync";

export const getAllLogsHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    const logs = await getAllLogs();

    const response = BaseHttpResponse.successResponse(logs);
    return res.json(response);
});
