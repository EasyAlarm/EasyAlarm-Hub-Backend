import mongoose from 'mongoose';

export default async (): Promise<boolean> =>
{
    try
    {
        await mongoose.connect(process.env.MONGO_URI!);
        return true;
    }
    catch (err)
    {
        console.log(err);
        return false;
    }
};
