import { SerialWriter } from "../serial/serialWriter";
import PayloadType from "../types/enums/payloadType";
import Unit from "./unit";

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
                    _id: "",
                    deviceID: deviceID,
                    type: "",
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