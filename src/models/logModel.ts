import mongoose from 'mongoose';

//enum severity type
export enum SeverityType
{
    INFO,
    WARNING,
    DANGER
}

export interface LogDocument extends mongoose.Document
{
    date: Date;
    context: string;
    severity: SeverityType;
}

const LogSchema = new mongoose.Schema
    ({
        date: { type: Date, default: Date.now },
        context: { type: String, required: true },
        severity: { type: String, required: true }
    });

const LogModel = mongoose.model('log', LogSchema);

export default LogModel;