import { Request, Response, NextFunction } from 'express';
import { getAllLogs } from "../services/logService";
import catchAsync from "../utils/catchAsync";

export const getAllLogsHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) =>
{
    const logs = await getAllLogs();
    return res.status(200).send({ data: logs });
});
