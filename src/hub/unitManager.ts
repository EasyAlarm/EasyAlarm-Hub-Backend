import { getAllUnits } from '../services/unitService';
import Unit from './units/unit';
import Siren from './units/siren';
import IProfile from './types/interfaces/IProfile';
import UnitFactory from './units/unitFactory';
import { IUnit } from './types/interfaces/IUnit';

export default class UnitManager
{
    private units: Array<Unit>;
    private unitFactory: UnitFactory;

    constructor(unitFactory: UnitFactory)
    {
        this.unitFactory = unitFactory;
        this.units = [];
    }

    public getUnits(): Array<Unit>
    {
        return this.units;
    }

    public getSpeaker(): Siren | undefined
    {
        //return first siren
        return this.units.find(unit => unit instanceof Siren) as Siren | undefined;
    }

    public async reload(): Promise<void>
    {
        // Clear the array without reassigning it
        this.units.length = 0;

        const unitModels = await getAllUnits();
        unitModels.forEach((unitModel: IUnit) =>
        {
            const unit = this.unitFactory.createUnit(unitModel);
            if (unit)
            {
                this.units.push(unit);
            }
        });
    }
    public ceaseSirens(): void
    {
        this.units.forEach(siren =>
        {
            if (!(siren instanceof Siren))
            {
                return;
            }

            siren.stopBuzzer();
        });
    }

    public fireSirens(profile?: IProfile): void
    {
        this.units.forEach(siren =>
        {
            if (!(siren instanceof Siren))
            {
                return;
            }


            if (profile && !profile.unitIDS.some(u => u.toString() === siren._id.toString()))
            {
                return;
            }

            siren.startBuzzer();
        });
    }
}