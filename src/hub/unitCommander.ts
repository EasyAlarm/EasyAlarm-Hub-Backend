import Unit from "./unit";
import serialHandler = require('./serialHandler');
import PayloadType from "./payloadType";

export default class UnitCommander
{
    public static send(nodeAddress: string | Unit, payload: PayloadType, content?: string): void
    {
        if (nodeAddress instanceof Unit)
            nodeAddress = nodeAddress.getNodeAddress();

        serialHandler.write(`${payload}!${nodeAddress}!${content || ""}`);
    }
}