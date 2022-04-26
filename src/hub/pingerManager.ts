import { IUnit } from "../interfaces/IUnit";
import sleep from "../utils/sleep";
import Pinger from "./pinger";

export default class PingerManager
{
    private pingers: Array<Pinger>;
    private shouldPing: boolean = true;
    private globalInterval: number = 3000;
    private betweenPingsInterval: number = 100;

    constructor()
    {
        this.pingers = [];
    }

    public async init(units: Array<IUnit>)
    {
        this.reloadPingers(units);

        console.log(`PingerManager: ${this.pingers.length} pinger(s) initialized`);

        while (this.shouldPing)
        {
            for (let i = 0; i < this.pingers.length; i++)
            {
                this.pingers[i].ping();
                await sleep(this.betweenPingsInterval);
            }

            await sleep(this.globalInterval);
        }
    }

    public confirmPong(unit: IUnit): void
    {
        this.pingers.forEach((pinger: Pinger) =>
        {
            if (pinger.getUnit().deviceID === unit.deviceID)
            {
                pinger.reset();
            }
        });
    }

    public reloadPingers(units: Array<IUnit>): void
    {
        this.pingers = [];

        units.forEach((unitModel: IUnit) =>
        {
            let pinger = new Pinger(unitModel);
            this.pingers.push(pinger);
        });
    }

}