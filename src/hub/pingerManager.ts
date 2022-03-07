import sleep from "../utils/sleep";
import Pinger from "./pinger";
import Unit from "./unit";

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

    public async init(units: Array<Unit>)
    {
        this.clearPingers();

        units.forEach((unitModel: any) =>
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

    public confirmPong(unit: Unit): void
    {
        this.pingers.forEach((pinger: Pinger) =>
        {
            if (pinger.getUnit().getId() === unit.getId())
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