import mongoose from 'mongoose';
import { DocumentDefinition } from 'mongoose';
import { IUnit } from '../interfaces/IUnit';
import ProfileModel, { ProfileDocument } from '../models/profileModel';
import { getAllUnits } from './unitService';

export async function createProfile(profileName: string)
{
    try 
    {
        return await ProfileModel.create(profileName);
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

export async function doesProfileExist(profileName: string): Promise<boolean>
{
    try 
    {
        const doc = await ProfileModel.find({ name: profileName });

        if (doc)
        {
            return true;
        }
    }
    catch (error: any) 
    {
        throw new Error(error);
    }

    return false;
}

export async function updateProfile(profileName: string, profileUnitsIDS: string[]): Promise<ProfileDocument | null>
{
    try 
    {
        const units = await getAllUnits();
        const unitsIDS: string[] = [];
        profileUnitsIDS.forEach(deviceID =>
        {
            const unitModel = units.find((unit: IUnit) => unit.deviceID === deviceID);

            if (unitModel)
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