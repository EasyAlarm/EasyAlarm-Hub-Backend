import { Request, Response, NextFunction } from 'express';
import ApiError from '../exceptions/api/apiError';
import InternalServerError from '../exceptions/api/internalServerError';

const errorHandler = (apiError: ApiError, req: Request, res: Response, next: NextFunction) =>
{
    let responseError;

    if (apiError.getStatusCode() === 500)
    {
        responseError = new InternalServerError();
    }

    res.status(apiError.getStatusCode()).json({
        message: apiError.message,
        statusCode: apiError.getStatusCode(),
        errorCode: apiError.getErrorCode()
    });
};

export default errorHandler;