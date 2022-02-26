import { DocumentDefinition } from 'mongoose';
import UserModel, { UserDocument } from '../models/userModel';
import bcrypt = require('bcryptjs');

export async function createUser(input: DocumentDefinition<UserDocument>)
{
    try
    {
        let user: UserDocument = new UserModel({
            username: input.username,
            password: input.password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        return await user.save();
    }
    catch (error: any)
    {
        throw new Error(error);
    }
}

export async function hasAlreadyRegistered(): Promise<boolean>
{
    return await UserModel.count() > 0;
}

export async function getUser(username: string): Promise<UserDocument | null>
{
    return await UserModel.findOne({ username });
}

export async function isValidPassword(user: UserDocument, password: string): Promise<boolean>
{
    return await bcrypt.compare(password, user.password);
}
