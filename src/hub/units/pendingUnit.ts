import { SerialWriter } from "../serial/serialWriter";
import PayloadType from "../types/enums/payloadType";
import Unit from "./unit";
import { ObjectId } from 'mongodb';
import UnitType from "../types/enums/unitType";


export default class PendingUnit extends Unit
{
    public isPingable(): boolean
    {
        return false;
    }

    constructor(deviceID: string, serialWriter: SerialWriter)
    {
        super
            (
                {
                    _id: new ObjectId(),
                    deviceID: deviceID,
                    type: UnitType.Pending,
                    nodeAddress: "",
                    friendlyName: "",
                    online: false
                },
                serialWriter
            );
    }

    public acknowledgePing(nodeAddress: string)
    {
        this.processPayload(PayloadType.OK, nodeAddress);
    }
}