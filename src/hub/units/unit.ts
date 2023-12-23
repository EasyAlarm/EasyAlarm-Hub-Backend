import { SerialWriter } from "../serial/serialWriter";
import PayloadType from "../types/enums/payloadType";
import { IUnit } from "../types/interfaces/IUnit";

export default abstract class Unit implements IUnit
{
    _id: string;
    deviceID: string;
    type: string;
    nodeAddress: string;
    friendlyName: string;
    online: boolean;

    private serialWriter: SerialWriter;

    constructor(unit: IUnit, serialWriter: SerialWriter)
    {
        this._id = unit._id;
        this.deviceID = unit.deviceID;
        this.type = unit.type;
        this.nodeAddress = unit.nodeAddress;
        this.friendlyName = unit.friendlyName;
        this.online = unit.online;

        this.serialWriter = serialWriter;
    }

    protected processPayload(payload: PayloadType, content?: string)
    {
        this.serialWriter.write(`${payload}!${this.nodeAddress}!${content || ""}`);
    }

    public abstract isPingable(): boolean;

    public ping()
    {
        this.processPayload(PayloadType.PING);
    }
}