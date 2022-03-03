import Unit from "./unit";
import sleep from "../utils/sleep";
import UnitManager from "./unitManager";
import UnitCommander from "./unitCommander";

export default class Pinger
{
    private unit: Unit;

    private failedPingCounter: number = 0;
    private failedPingThreshold: number = 3;
    private interval: number = 3;
    private shouldPing: boolean = true;

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

    public stop(): void
    {
        this.shouldPing = false;
    }

    public async init(): Promise<void>
    {
        while (this.shouldPing)
        {
            UnitCommander.ping(this.unit);

            await sleep(1000 * this.interval);

            this.failedPingCounter++;

            if (this.failedPingCounter >= this.failedPingThreshold)
            {
                UnitManager.getEvents().emit("offline", this.unit);
            }
        }
    }
}