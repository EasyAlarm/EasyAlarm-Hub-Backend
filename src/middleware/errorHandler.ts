import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError';

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) =>
{
    if (err.getStatusCode() == 500)
    {
        console.log(err);
        err.message = "Internal Server Error";
    }

    res.status(err.getStatusCode()).json({
        errors: [{ msg: err.message }]
    });
};

export default errorHandler;