import { number, object, string, TypeOf } from "zod";

export const hubSettingsSchema = object({
    body: object({
        alarmDuration: string({
            required_error: "Alarm duration is required"
        }),
        alarmDelay: string({
            required_error: "Alarm delay is required"
        }),
        armDelay: string({
            required_error: "Arm delay is required"
        }),
    })
});

export type UpdateHubSettingsSchema = TypeOf<typeof hubSettingsSchema>;