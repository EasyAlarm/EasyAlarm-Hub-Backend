import Unit from "./unit";
import serialHandler = require('./serialHandler');
import PayloadType from "./payloadType";

export default class UnitCommander
{

    public static fire(unit: Unit): void
    {

    }

    public static cease(unit: Unit): void
    {

    }

    public static ping(unit: Unit): void
    {
        serialHandler.write(`${PayloadType.PING}!${unit.getNodeAddress()}!!`);
    }


}