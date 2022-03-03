import { DocumentDefinition } from 'mongoose';
import UnitModel, { UnitDocument } from '../models/unitModel';

const getUnitType = (unitID: string): any =>
{
    let firstChar: string = unitID.charAt(0);

    let dict: any =
    {
        a: "DoorGuard",
        b: "MotionSensor",
        c: "Siren"
    };

    return dict[firstChar];
};


export async function createUnit(input: DocumentDefinition<UnitDocument>)
{
    try
    {
        let unit: UnitDocument = new UnitModel({
            unitType: getUnitType(input.unitID),
            friendlyName: input.friendlyName,
            unitID: input.unitID,
            nodeAddress: "01"
        });

        return await unit.save();
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function getUnit(unitID: string): Promise<UnitDocument | null>
{
    try
    {
        return await UnitModel.findOne({ unitID });
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function getAllUnits(): Promise<UnitDocument | null | any>
{
    try
    {
        return await UnitModel.find();
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function deleteUnit(unitID: string): Promise<UnitDocument | null>
{
    try
    {
        return await UnitModel.findOneAndRemove({ unitID });
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function updateUnit(unitID: string, unitFriendlyName: string): Promise<UnitDocument | null>
{
    try
    {
        const filter = { unitID };
        const update = { unitFriendlyName };
        return await UnitModel.findOneAndUpdate(filter, update);
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}
