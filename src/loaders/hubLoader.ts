import HubCore from "../hub/hubCore";

export default async (): Promise<boolean> =>
{
    try 
    {
        HubCore.init();
        return true;
    }
    catch (error)
    {
        return false;
    }
};