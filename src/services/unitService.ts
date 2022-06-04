import { DocumentDefinition } from 'mongoose';
import HubCore from '../hub/hubCore';
import Pairer, { PairingState } from '../hub/pairer';
import { IUnit } from '../interfaces/IUnit';
import UnitModel, { UnitDocument } from '../models/unitModel';
import getNextNodeAddr from '../utils/getNextNodeAddr';

const getUnitType = (deviceID: string): any =>
{
    let firstChar: string = deviceID.charAt(0);

    let dict: any =
    {
        a: "DoorGuard",
        b: "MotionSense",
        c: "Siren",
        d: "KeyFob"
    };

    return dict[firstChar];
};

export async function createUnit(input: DocumentDefinition<UnitDocument>)
{
    try
    {
        const pairer: Pairer = new Pairer(input.deviceID);

        const state: PairingState = await pairer.waitForPairingRequest();

        if (state === PairingState.FAILED)
            return false;

        const nodeAddr = await getNextNodeAddr();


        const unit: UnitDocument = new UnitModel({
            type: getUnitType(input.deviceID),
            friendlyName: input.friendlyName,
            deviceID: input.deviceID,
            nodeAddress: nodeAddr
        });

        await unit.save();

        await HubCore.unitManager.reload();

        return true;
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function getUnit(deviceID: string): Promise<UnitDocument | null>
{
    try
    {
        return await UnitModel.findOne({ deviceID });
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function getAllUnits(): Promise<Array<IUnit>>
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

export async function deleteUnit(deviceID: string): Promise<UnitDocument | null>
{
    try
    {
        const doc = await UnitModel.findOneAndRemove({ deviceID });
        await HubCore.unitManager.reload();
        return doc;
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function updateUnit(deviceID: string, unitFriendlyName: string): Promise<UnitDocument | null>
{
    try
    {
        const filter = { deviceID };
        const update = { friendlyName: unitFriendlyName };
        const doc = await UnitModel.findOneAndUpdate(filter, update);
        await HubCore.unitManager.reload();
        return doc;
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function setUnitOnlineStatus(deviceID: string, online: boolean): Promise<UnitDocument | null>
{
    try
    {
        const filter = { deviceID };
        const update = { online };
        return await UnitModel.findOneAndUpdate(filter, update);
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function doUnitsExist(unitsIDS: string[])
{
    try
    {
        const units: UnitDocument[] = await UnitModel.find({ unitID: { $in: unitsIDS } });

        if (units.length !== unitsIDS.length)
            return false;

        return true;
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}
