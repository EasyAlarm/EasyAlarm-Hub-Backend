import mongoose from 'mongoose';
import HubStateType from '../hub/types/enums/hubStateType';
import UnitType from '../hub/types/enums/unitType';

export enum ActionType
{
    Triggered = "Triggered",
    Armed = "Armed",
    Disarmed = "Disarmed",
    Panicked = "Panicked",
    LoggedIn = "LoggedIn"
}

export const Source =
{
    ...UnitType,
    Hub: "Hub",
    WebApp: "WebApp",
};

type SourceType = typeof Source[keyof typeof Source];


export interface LogDocument extends mongoose.Document
{
    action: ActionType,
    source: SourceType,
    friendlyName?: string | null;
    hubState: HubStateType;
}

const LogSchema = new mongoose.Schema
    ({
        timestamp: { type: Date, default: Date.now },
        action: { type: String },
        source: { type: String },
        friendlyName: { type: String },
        hubState: { type: String }
    });

const LogModel = mongoose.model('log', LogSchema);

export default LogModel;