import { DocumentDefinition } from 'mongoose';
import HubStateType from '../hub/types/enums/hubStateType';
import { IUnit } from '../hub/types/interfaces/IUnit';
import LogModel, { LogDocument, SeverityType } from '../models/logModel';


export async function createLog(log: DocumentDefinition<LogDocument>)
{
    try
    {
        return await LogModel.create(log);
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function createOfflineUnitLog(unit: IUnit)
{
    try
    {
        return await createLog({
            date: new Date(),
            context: `Unit ${unit.friendlyName} (${unit.deviceID}) is offline`,
            severity: SeverityType.WARNING
        });
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}


export async function createSensorTriggeredLog(unit: IUnit)
{
    try
    {
        return await createLog({
            date: new Date(),
            context: `Sensor ${unit.friendlyName} (${unit.deviceID}) triggered`,
            severity: SeverityType.DANGER
        });
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function createUnitFired(unit: IUnit)
{
    try
    {
        return await createLog({
            date: new Date(),
            context: `Unit ${unit.friendlyName} (${unit.deviceID}) fired`,
            severity: SeverityType.DANGER
        });
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function createhubStateLog(hubState: HubStateType)
{
    try
    {
        return await createLog({
            date: new Date(),
            context: `Hub state is ${HubStateType[hubState]}`,
            severity: HubStateType.ALARM ? SeverityType.DANGER : SeverityType.INFO
        });
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function getAllLogs()
{
    try
    {
        return await LogModel.find();
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}