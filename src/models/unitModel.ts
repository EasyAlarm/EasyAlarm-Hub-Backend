import mongoose from 'mongoose';

export interface UnitDocument extends mongoose.Document
{
    friendlyName: string;
    deviceID: string;
}

const UnitSchema = new mongoose.Schema
    ({
        type:
        {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 16
        },
        friendlyName:
        {
            type: String,
            required: true,
            maxlength: 16,
            minlength: 3
        },
        deviceID:
        {
            type: String,
            required: true,
            length: 6
        },
        nodeAddress:
        {
            type: String,
            required: true,
            length: 5
        },
        online:
        {
            type: Boolean,
            default: true
        }
    });


const UnitModel = mongoose.model('unit', UnitSchema);
export default UnitModel;