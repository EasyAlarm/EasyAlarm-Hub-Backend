import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
    body: object({
        username: string({
            required_error: 'Name is required'
        }),
        password: string({
            required_error: 'Password is required'
        }).min(6, "Password must be at least 6 or more characters"),
        rePassword: string({
            required_error: 'Password confirmation is required'
        })
    }).refine((data) => data.password === data.rePassword, {
        message: "Passwords do not match"
    }),
});

export const verifyUserSchema = object({
    body: object({
        username: string({
            required_error: 'Name is required'
        }),
        password: string({
            required_error: 'Password is required'
        }),
    }),
});

export const refreshTokenSchema = object({
    body: object({
        refreshToken: string({
            required_error: 'Refresh token is required'
        }),
    }),
});

export type RefreshTokenInput = TypeOf<typeof refreshTokenSchema>;
export type CreateUserInput = TypeOf<typeof createUserSchema>;
export type LoginUserInput = TypeOf<typeof verifyUserSchema>;

