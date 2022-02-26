import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
    body: object({
        username: string({
            required_error: 'Name is required'
        }),
        password: string({
            required_error: 'Password is required'
        }).min(6, "Password must be at least 6 or more characters")
    })
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;

