import { Request, Response, NextFunction } from 'express';
import ApiError from './apiError';


export default (fn: any) =>
{
    return (req: Request, res: Response, next: NextFunction) =>
    {
        fn(req, res, next).catch((err: Error) => next(new ApiError(err.message, 500)));
    };
};