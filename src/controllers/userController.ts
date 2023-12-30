import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../models/userModel';
import { CreateUserInput, LoginUserInput, RefreshTokenInput } from '../schemas/userSchema';
import { createUser, hasAlreadyRegistered, getUser, isValidPassword, getUserById } from '../services/userService';
import ApiError from '../utils/apiError';
import { BaseHttpResponse } from '../utils/baseHttpResponse';
import catchAsync from '../utils/catchAsync';

const generateTokens = (user: UserDocument) =>
{
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET as jwt.Secret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as jwt.Secret, { expiresIn: '7d' });

    return { accessToken, refreshToken };

};

export const registerUserHandler = catchAsync(async (req: Request<{}, {}, CreateUserInput['body']>, res: Response, next: NextFunction) =>
{
    if (await hasAlreadyRegistered())
    {
        return next(new ApiError("You have already registered an account", 400));
    }

    const userDocument = await createUser(req.body);

    const { accessToken, refreshToken } = generateTokens(userDocument);

    const response = BaseHttpResponse.successResponse({ accessToken, refreshToken, user: userDocument });

    res.status(response.status).json(response);

});

export const loginUserHandler = catchAsync(async (req: Request<{}, {}, LoginUserInput['body']>, res: Response, next: NextFunction) =>
{
    const userDocument = await getUser(req.body.username);

    if (!userDocument)
    {
        return next(new ApiError("Invalid credentials", 401));
    }


    if (!await isValidPassword(userDocument, req.body.password))
    {
        return next(new ApiError("Invalid credentials", 401));
    }

    const { accessToken, refreshToken } = generateTokens(userDocument);

    const response = BaseHttpResponse.successResponse({ accessToken, refreshToken, user: userDocument });

    res.status(response.status).json(response);
});

export const refreshTokenHandler = catchAsync(async (req: Request<{}, {}, RefreshTokenInput['body']>, res: Response, next: NextFunction) =>
{
    const { refreshToken } = req.body;

    if (!refreshToken)
    {
        return next(new ApiError("Refresh Token required", 401));
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as jwt.Secret, async (err, decoded) =>
    {
        if (err)
        {
            return next(new ApiError("Invalid Refresh Token", 403));
        }

        if (typeof decoded !== 'object' || !decoded.id)
        {
            return next(new ApiError("Invalid Token Data", 400));
        }

        const userDocument = await getUserById(decoded.id);

        if (!userDocument)
        {
            return next(new ApiError("User not found", 404));
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(userDocument);

        const response = BaseHttpResponse.successResponse({ accessToken, refreshToken: newRefreshToken });

        res.status(response.status).json(response);
    });
});
