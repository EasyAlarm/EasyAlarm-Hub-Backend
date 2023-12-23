import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../models/userModel';
import { CreateUserInput, LoginUserInput } from '../schemas/userSchema';
import { createUser, hasAlreadyRegistered, getUser, isValidPassword } from '../services/userService';
import ApiError from '../utils/apiError';
import { BaseHttpResponse } from '../utils/baseHttpResponse';
import catchAsync from '../utils/catchAsync';

const generateToken = (user: UserDocument) =>
{
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '1h' });
};

export const registerUserHandler = catchAsync(async (req: Request<{}, {}, CreateUserInput['body']>, res: Response, next: NextFunction) =>
{
    if (await hasAlreadyRegistered())
    {
        return next(new ApiError("You have already registered an account", 400));
    }

    const userDocument = await createUser(req.body);

    const token = generateToken(userDocument);

    const response = BaseHttpResponse.successResponse({ token, user: userDocument }, 201);

    res.status(response.status).json(response);

});

export const loginUserHandler = catchAsync(async (req: Request<{}, {}, LoginUserInput['body']>, res: Response, next: NextFunction) =>
{
    const userDocument = await getUser(req.body.username);

    if (!userDocument)
    {
        return next(new ApiError("Invalid credentials", 400));
    }


    if (!await isValidPassword(userDocument, req.body.password))
    {
        return next(new ApiError("Invalid credentials", 400));
    }

    const token = generateToken(userDocument);


    const response = BaseHttpResponse.successResponse({ token, user: userDocument });

    res.status(response.status).json(response);
});