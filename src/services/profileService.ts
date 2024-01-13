import IProfile from '../hub/types/interfaces/IProfile';
import { IUnit } from '../hub/types/interfaces/IUnit';
import ProfileModel, { ProfileDocument } from '../models/profileModel';
import { getAllUnits } from './unitService';

export async function createProfile(profileName: string)
{
    try 
    {

        const profile: ProfileDocument = new ProfileModel({
            name: profileName
        });

        profile.save();

        return profile;
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
        return await ProfileModel.findOne({ name: profileName });
    }
    catch (error: any) 
    {
        throw new Error(error);
    }
}

export async function getProfiles(): Promise<Array<IProfile>>
{
    const profileModels = await ProfileModel.find().select('name');

    return profileModels;
}

export async function doesProfileExist(profileName: string): Promise<boolean>
{
    try 
    {
        const doc = await ProfileModel.findOne({ name: profileName });

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
        profileUnitsIDS.forEach(_id =>
        {
            const unitModel = units.find((unit: IUnit) => unit._id.equals(_id));

            if (unitModel)
                unitsIDS.push(unitModel._id.toString());
        });

        //convert to objectid
        const filter = { name: profileName };
        const update = { unitIDS: unitsIDS };
        return await ProfileModel.findOneAndUpdate(filter, update);

    }
    catch (error: any) 
    {
        throw new Error(error);
    }
}