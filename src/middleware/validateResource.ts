import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    }
    catch (error: any)
    {
        const errors: Array<string> = [];
        error.issues.forEach((errorObject: any) =>
        {
            errors.push(errorObject.message);
        });


        return res.status(400).json({ errors: errors });
    }
};

export default validate;