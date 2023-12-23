import mongoose from "mongoose";

export interface AlarmSettingsDocument extends mongoose.Document
{
    armDelay: number;
    alarmDelay: number;
    alarmDuration: number;
    alarmOnOfflineUnit: boolean;
}

const AlarmSettingsSchema = new mongoose.Schema
    ({
        armDelay:
        {
            type: Number,
            rquired: true,
            default: 10
        },
        alarmDelay:
        {
            type: Number,
            rquired: true,
            default: 5
        },
        alarmDuration:
        {
            type: Number,
            rquired: true,
            default: 360,
        },
        alarmOnOfflineUnit:
        {
            type: Boolean,
            rquired: true,
            default: false
        },
    });

const AlarmSettingsModel = mongoose.model('alarmSettings', AlarmSettingsSchema);
export default AlarmSettingsModel;