import { DocumentDefinition } from 'mongoose';
import LogModel, { LogDocument } from '../models/logModel';


export async function createLog(log: DocumentDefinition<LogDocument>)
{
    try
    {
        const lastLog = await LogModel.findOne().sort({ timestamp: -1 });

        if (lastLog && log.action === lastLog.action && log.source === lastLog.source &&
            log.friendlyName === lastLog.friendlyName && log.hubState === lastLog.hubState)
        {
            return null;
        }

        return await LogModel.create(log);
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
        return await LogModel.find().sort({ _id: -1 }).limit(100);

    }
    catch (error: any)
    {
        throw new Error(error);
    }
}