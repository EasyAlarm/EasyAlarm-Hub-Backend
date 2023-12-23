import { EventEmitter } from "stream";
import Unit from "./units/unit";

export default class Pinger
{
    private unit: Unit;
    private eventEmitter: EventEmitter;

    private failedPingCounter: number = 0;
    private failedPingThreshold: number = 3;

    constructor(unit: Unit, eventEmitter: EventEmitter)
    {
        this.unit = unit;
        this.eventEmitter = eventEmitter;
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
        this.unit.ping();

        this.failedPingCounter++;

        if (this.failedPingCounter >= this.failedPingThreshold)
        {
            this.eventEmitter.emit("offline", this.unit);
        }
    }
}