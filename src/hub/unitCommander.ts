import serialHandler = require('./serialHandler');
import PayloadType from "./payloadType";
import { IUnit } from '../interfaces/IUnit';

export default class UnitCommander
{
    public static send(nodeAddress: string | IUnit, payload: PayloadType, content?: string): void
    {
        if (this.instanceOfUnit(nodeAddress))
            nodeAddress = nodeAddress.nodeAddress;

        serialHandler.write(`${payload}!${nodeAddress}!${content || ""}`);
    }

    private static instanceOfUnit(data: any): data is IUnit
    {
        try
        {
            return 'nodeAddress' in data;
        }
        catch (error: any)
        {
            return false;
        }
    }
}