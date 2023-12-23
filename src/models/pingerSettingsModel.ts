import mongoose from "mongoose";

export interface PingerSettingsDocument extends mongoose.Document
{
    shouldPing: boolean;
    globalPingInterval: number;
    betweenPingsInterval: number;
}

const PingerSettingsSchema = new mongoose.Schema
    ({
        shouldPing:
        {
            type: Boolean,
            rquired: true,
            default: true
        },
        globalPingInterval:
        {
            type: Number,
            rquired: true,
            default: 3000
        },
        betweenPingsInterval:
        {
            type: Number,
            rquired: true,
            default: 100
        },
    });

const PingerSettingsModel = mongoose.model('pingerSettings', PingerSettingsSchema);
export default PingerSettingsModel;