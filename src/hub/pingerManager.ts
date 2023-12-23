import sleep from "../utils/sleep";
import Pinger from "./pinger";
import { EventEmitter } from "stream";
import Unit from "./units/unit";
import { getPingerSettings } from "../services/settingsService";

export default class PingerManager
{
    private pingers: Array<Pinger>;
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter)
    {
        this.eventEmitter = eventEmitter;

        this.pingers = [];
    }

    public async init(units: Array<Unit>)
    {
        const pingerSettings = await getPingerSettings();


        this.reloadPingers(units);

        console.log(`PingerManager: ${this.pingers.length} pinger(s) initialized`);

        while (pingerSettings.shouldPing)
        {
            for (let i = 0; i < this.pingers.length; i++)
            {
                this.pingers[i].ping();
                await sleep(pingerSettings.betweenPingsInterval);
            }

            await sleep(pingerSettings.globalPingInterval);
        }
    }

    public confirmPong(unit: Unit): void
    {
        this.pingers.forEach((pinger: Pinger) =>
        {
            if (pinger.getUnit().deviceID === unit.deviceID)
            {
                pinger.reset();
            }
        });
    }

    public reloadPingers(units: Array<Unit>): void
    {
        this.pingers = [];

        units.forEach((unit: Unit) =>
        {
            if (!unit.isPingable())
            {
                return;
            }

            let pinger = new Pinger(unit, this.eventEmitter);
            this.pingers.push(pinger);
        });
    }

}