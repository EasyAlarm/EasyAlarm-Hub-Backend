import mongooseLoader from './mongoose';

export default async () =>
{
    if (!await mongooseLoader())
    {
        console.log("MongoDB connected");
    }
}; 