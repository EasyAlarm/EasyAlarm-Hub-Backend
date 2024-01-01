import { Request, Response, NextFunction } from 'express';
import InternalServerError from '../exceptions/api/internalServerError';


export default (fn: any) =>
{
    return (req: Request, res: Response, next: NextFunction) =>
    {
        fn(req, res, next).catch((err: Error) => next(new InternalServerError(err.message)));
    };
};