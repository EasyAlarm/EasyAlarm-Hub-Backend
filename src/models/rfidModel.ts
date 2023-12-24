import mongoose from 'mongoose';

export interface RfidCardDocument extends mongoose.Document
{
    passcode: string;
}

const RfidCardSchema = new mongoose.Schema
    ({
        passcode:
        {
            type: String,
            required: true,
            length: 3,
        }
    });

const RfidModel = mongoose.model('rfid', RfidCardSchema);
export default RfidModel;