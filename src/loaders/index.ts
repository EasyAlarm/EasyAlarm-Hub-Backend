import hubLoader from './hubLoader';
import mongooseLoader from './mongoose';

export default async () =>
{
    if (await mongooseLoader())
    {
        console.log("MongoDB connected");
    }

    if (await hubLoader())
    {
        console.log("Hub loaded");
    }
}; 