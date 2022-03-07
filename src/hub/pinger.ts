import Unit from "./unit";
import sleep from "../utils/sleep";
import UnitManager from "./unitManager";
import UnitCommander from "./unitCommander";
import PayloadType from "./payloadType";

export default class Pinger
{
    private unit: Unit;

    private failedPingCounter: number = 0;
    private failedPingThreshold: number = 3;

    constructor(unit: Unit)
    {
        this.unit = unit;
    }

    public getUnit(): Unit
    {
        return this.unit;
    }

    public reset(): void
    {
        this.failedPingCounter = 0;
    }

    public ping(): void
    {
        UnitCommander.send(this.unit, PayloadType.PING);

        this.failedPingCounter++;

        if (this.failedPingCounter >= this.failedPingThreshold)
        {
            UnitManager.getEvents().emit("offline", this.unit);
        }
    }
}