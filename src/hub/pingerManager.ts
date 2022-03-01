import Pinger from "./pinger";
import Unit from "./unit";

export default class PingerManager
{
    private pingers: Array<Pinger>;

    constructor()
    {
        this.pingers = [];
    }

    public init(units: Array<Unit>): void
    {
        this.clearPingers();

        units.forEach((unitModel: any) =>
        {
            let pinger = new Pinger(unitModel);
            pinger.init();

            this.pingers.push(pinger);
        });

        console.log("PingerManager initialized");
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
        if (this.pingers.length > 0)
            return;

        this.pingers.forEach(pinger =>
        {
            pinger.stop();
        });

        this.pingers = [];
    }

}