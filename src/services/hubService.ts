import HubCore from "../hub/hubCore";
import IHubStatus from "../hub/types/interfaces/IHubStatus";
import IProfile from "../hub/types/interfaces/IProfile";
import { IUnit } from "../hub/types/interfaces/IUnit";
import { getProfile } from "./profileService";

export async function armHub(profileName: string)
{
    const profileModel = await getProfile(profileName);

    if (!profileModel)
    {
        return false;
    }

    const units = profileModel.unitIDS;
    const profile: IProfile =
    {
        name: profileModel.name,
        unitIDS: units.map((unit: IUnit) => unit._id)
    };

    HubCore.getInstance().getAlarmSystem().arm(profile);

    return true;
}

export async function disarmHub() 
{
    HubCore.getInstance().getAlarmSystem().disarm();
    return true;
}

export async function panicHub()
{
    HubCore.getInstance().getAlarmSystem().panic();
    return true;
}

export async function getHubStatus(): Promise<IHubStatus>
{
    return HubCore.getInstance().getStatus();
}
