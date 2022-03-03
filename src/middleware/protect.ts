import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const protect = (req: any, res: Response, next: NextFunction) =>
{
    const token = req.header('x-auth-token');

    if (!token)
    {
        return res.status(401).json({ msg: 'No token' });
    }

    try
    {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);

        req.user = decoded.user;

        next();

    }
    catch (err)
    {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default protect;