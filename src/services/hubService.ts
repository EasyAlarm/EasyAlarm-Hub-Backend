import HubCore from "../hub/hubCore";
import HubStateType from "../hub/hubStateType";
import IHubStatus from "../hub/IHubStatus";
import IProfile from "../hub/IProfile";
import { IUnit } from "../interfaces/IUnit";
import { getProfile } from "./profileService";

export async function armHub(profileName: string)
{
    const profileModel = await getProfile(profileName);

    if (!profileModel)
    {
        return false;
    }

    const units = profileModel.units;
    const profile: IProfile =
    {
        name: profileModel.name,
        unitIDS: units.map((unit: IUnit) => unit._id)
    };

    HubCore.arm(profile);

    return true;
}

export async function disarmHub() 
{
    HubCore.disarm();
    return true;
}

export async function panicHub()
{
    HubCore.panic();
    return true;
}

export async function getHubStatus(): Promise<IHubStatus>
{
    return HubCore.getStatus();
}