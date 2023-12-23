import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BaseHttpResponse } from '../utils/baseHttpResponse';

const protect = (req: any, res: Response, next: NextFunction) =>
{
    const token = req.header('x-auth-token');

    if (!token)
    {
        const response = BaseHttpResponse.errorResponse(401, 'No token');
        return res.status(response.status).json(response);
    }

    try
    {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);

        req.user = decoded.user;

        next();

    }
    catch (err)
    {
        const response = BaseHttpResponse.errorResponse(401, 'Token is invalid');
        res.status(response.status).json(response);
    }
};

export default protect;