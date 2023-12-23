
import { boolean, number, object, TypeOf } from "zod";

export const updatePingerSettingsSchema = object({
    body: object({
        shouldPing: boolean({
            required_error: "Should ping is required"
        }),
        globalPingInterval: number({
            required_error: "Global ping interval is required"
        }),
        betweenPingsInterval: number({
            required_error: "Between pings interval is required"
        }),
    })
});

export type UpdatePingerSettingsSchema = TypeOf<typeof updatePingerSettingsSchema>;