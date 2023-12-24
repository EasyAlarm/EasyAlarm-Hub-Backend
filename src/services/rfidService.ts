import { DocumentDefinition } from 'mongoose';
import RfidModel, { RfidCardDocument } from '../models/rfidModel';
import bcrypt = require('bcryptjs');

export async function addRfidCard(input: DocumentDefinition<RfidCardDocument>)
{
    try
    {
        let rfidCard: RfidCardDocument = new RfidModel({
            passcode: input.passcode
        });

        const salt = await bcrypt.genSalt(10);
        rfidCard.passcode = await bcrypt.hash(rfidCard.passcode.trim(), salt);

        return await rfidCard.save();
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function isValidRfidCard(passcode: string): Promise<boolean>
{
    try
    {
        passcode = passcode.substring(0, 3);
        const cards = await RfidModel.find({});

        for (let card of cards)
        {
            if (await bcrypt.compare(passcode, card.passcode))
            {
                return true;
            }
        }

        return false;
    } catch (error: any)
    {
        throw new Error(error);
    }
}