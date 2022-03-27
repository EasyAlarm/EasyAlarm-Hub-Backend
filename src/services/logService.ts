import { DocumentDefinition } from 'mongoose';
import HubStateType from '../hub/hubStateType';
import Unit from '../hub/unit';
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

export async function createOfflineUnitLog(unit: Unit)
{
    try
    {
        return await createLog({
            date: new Date(),
            context: `Unit ${unit.getId()} is offline`,
            severity: SeverityType.WARNING
        });
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}


export async function createSensorTriggeredLog(unit: Unit)
{
    try
    {
        return await createLog({
            date: new Date(),
            context: `Sensor ${unit.getId()} triggered`,
            severity: SeverityType.DANGER
        });
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function createUnitFired(unit: Unit)
{
    try
    {
        return await createLog({
            date: new Date(),
            context: `Unit ${unit.getId()} fired`,
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
            severity: SeverityType.INFO
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