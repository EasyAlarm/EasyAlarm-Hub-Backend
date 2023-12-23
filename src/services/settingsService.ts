import AlarmSettingsModel, { AlarmSettingsDocument } from "../models/alarmSettingsModel";
import PingerSettingsModel, { PingerSettingsDocument } from "../models/pingerSettingsModel";

export async function getAlarmSettings(): Promise<AlarmSettingsDocument>
{
    return await AlarmSettingsModel.findOne() ?? await AlarmSettingsModel.create({});
}

export async function updateAlarmSettings(alarmSettings: AlarmSettingsDocument)
{
    const doc = await AlarmSettingsModel.findOneAndUpdate({}, alarmSettings);
    return doc;
}

export async function getPingerSettings(): Promise<PingerSettingsDocument>
{
    return await PingerSettingsModel.findOne() ?? await PingerSettingsModel.create({});
}

export async function updatePingerSettings(pingerSettings: PingerSettingsDocument)
{
    const doc = await PingerSettingsModel.findOneAndUpdate({}, pingerSettings);
    return doc;
}

