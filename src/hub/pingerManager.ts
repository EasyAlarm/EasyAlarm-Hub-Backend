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
        this.clearPingers();

        units.forEach((unitModel: IUnit) =>
        {
            let pinger = new Pinger(unitModel);
            this.pingers.push(pinger);
        });

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

    public clearPingers(): void
    {
        this.pingers = [];
    }

}