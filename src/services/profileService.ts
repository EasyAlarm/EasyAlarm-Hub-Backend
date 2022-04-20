import mongoose from 'mongoose';
import { DocumentDefinition } from 'mongoose';
import ProfileModel, { ProfileDocument } from '../models/profileModel';
import { getAllUnits } from './unitService';

export async function createProfile(profile: DocumentDefinition<ProfileDocument>)
{
    try 
    {
        return await ProfileModel.create(profile);
    }
    catch (error: any) 
    {
        throw new Error(error);
    }
}

export async function getProfile(profileName: string): Promise<ProfileDocument | null>
{
    try 
    {
        return await ProfileModel.findOne({ name: profileName }).populate('units');
    }
    catch (error: any) 
    {
        throw new Error(error);
    }
}

export async function updateProfile(profileName: string, profileUnitsIDS: string[]): Promise<ProfileDocument | null>
{
    try 
    {
        const units = await getAllUnits();
        const unitsIDS: string[] = [];
        profileUnitsIDS.forEach(unitID =>
        {
            const unitModel = units.find((unit: any) => unit.unitID === unitID);

            unitsIDS.push(unitModel._id);
        });

        //convert to objectid
        const filter = { name: profileName };
        const update = { units: unitsIDS };
        return await ProfileModel.findOneAndUpdate(filter, update);

    }
    catch (error: any) 
    {
        throw new Error(error);
    }
}