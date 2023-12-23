import { createhubStateLog } from "../services/logService";
import { getAlarmSettings } from "../services/settingsService";
import sleep from "../utils/sleep";
import HubStateType from "./types/enums/hubStateType";
import IProfile from "./types/interfaces/IProfile";
import UnitManager from "./unitManager";

export default class AlarmSystem
{
    private unitManager: UnitManager;

    private selectedProfile: IProfile;
    private hubState: HubStateType;

    constructor(unitManager: UnitManager)
    {
        this.unitManager = unitManager;

        this.hubState = HubStateType.DISARMED;

        this.selectedProfile =
        {
            name: "None",
            unitIDS: []
        };
    }

    public setState(state: HubStateType): void
    {
        this.hubState = state;
        createhubStateLog(state);
    }

    public getState(): HubStateType
    {
        return this.hubState;
    }

    public getCurentProfile(): IProfile
    {
        return this.selectedProfile;
    }

    public async arm(profile: IProfile)
    {
        const alarmSettings = await getAlarmSettings();

        this.setState(HubStateType.ARMING);

        const speaker = this.unitManager.getSpeaker();

        if (speaker)
        {
            speaker.playMultiTone();

            await sleep(200);

            for (let i = 0; i < alarmSettings.armDelay; i++)
            {
                if (this.hubState === HubStateType.DISARMED)
                    return;

                await sleep(1000);
                speaker.playTone();
            }
        }

        this.setState(HubStateType.ARMED);
        this.selectedProfile = profile;
    }

    public async disarm()
    {
        this.setState(HubStateType.DISARMED);
        this.unitManager.ceaseSirens();

        await sleep(200);

        const speaker = this.unitManager.getSpeaker();

        speaker?.playMultiTone();
    }

    public async alarm()
    {
        const alarmSettings = await getAlarmSettings();

        if (this.hubState === HubStateType.ALARM || this.hubState === HubStateType.TRIGGERED)
            return;

        this.setState(HubStateType.TRIGGERED);

        const speaker = this.unitManager.getSpeaker();

        if (speaker)
        {
            speaker.enableContinuousTone();

            for (let i = 0; i < alarmSettings.alarmDelay; i++)
            {
                if (this.hubState === HubStateType.DISARMED)
                {
                    return;
                }
                await sleep(1000);
            }

            speaker.disableContinuousTone();

            await sleep(200);
        }

        this.setState(HubStateType.ALARM);
        this.unitManager.fireSirens(this.selectedProfile);
    }

    public async panic()
    {
        this.setState(HubStateType.ALARM);
        this.unitManager.fireSirens();
    }

}