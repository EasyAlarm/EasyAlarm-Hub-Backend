import { object, string, TypeOf } from "zod";

export const armHubSchema = object({
    params: object({
        profileName: string({
            required_error: "Profile name is required"
        })
    })
});

export type ArmHubInput = TypeOf<typeof armHubSchema>;
