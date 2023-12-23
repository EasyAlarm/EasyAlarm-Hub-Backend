import { boolean, number, object, TypeOf } from "zod";

export const updateAlarmSettingsSchema = object({
    body: object({
        armDelay: number({
            required_error: "Arm delay is required"
        }),
        alarmDelay: number({
            required_error: "Alarm delay is required"
        }),
        alarmDuration: number({
            required_error: "Alarm duration is required"
        }),
        alarmOnOfflineUnit: boolean({
            required_error: "Alarm on offline unit is required"
        })
    })
});

export type UpdateAlarmSettingsSchema = TypeOf<typeof updateAlarmSettingsSchema>;