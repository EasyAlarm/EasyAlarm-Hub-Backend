import { array, object, string, TypeOf, ZodArray, ZodString } from "zod";

export const createProfileSchema = object({
    body: object({
        name: string({
            required_error: "Profile name is required"
        }).min(3, "Profile name must be at least 3 characters long")
    })
});


export const getProfileSchema = object({
    params: object({
        name: string({
            required_error: "Profile name is required"
        })
    })
});

export const updateProfileSchema = object({
    params: object({
        name: string({
            required_error: "Profile name is required"
        })
    }),
    body: object({
        unitsIDS: array(string()).min(1, "At least one unit ID is required")
    })
});


export type CreateProfileInput = TypeOf<typeof createProfileSchema>;

export type GetProfileInput = TypeOf<typeof getProfileSchema>;

export type UpdateProfileInput = TypeOf<typeof updateProfileSchema>;
