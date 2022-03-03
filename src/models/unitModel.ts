import mongoose from 'mongoose';

export interface UnitDocument extends mongoose.Document
{
    friendlyName: string;
    unitID: string;
}

const UnitSchema = new mongoose.Schema
    ({
        unitType:
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
        unitID:
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
        }
    });


const UnitModel = mongoose.model('unit', UnitSchema);
export default UnitModel;