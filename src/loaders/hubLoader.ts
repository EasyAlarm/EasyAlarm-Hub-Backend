import HubCore from "../hub/hubCore";

export default async (): Promise<boolean> =>
{
    try 
    {
        HubCore.getInstance().init();
        return true;
    }
    catch (error)
    {
        return false;
    }
};