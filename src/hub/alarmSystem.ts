import { ActionType, Source } from "../models/logModel";
import { createLog } from "../services/logService";
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

        this.hubState = HubStateType.Disarmed;

        this.selectedProfile =
        {
            name: "None",
            unitIDS: []
        };
    }

    public setState(state: HubStateType): void
    {
        this.hubState = state;
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
        createLog({ action: ActionType.Armed, source: Source.Hub, hubState: this.hubState });

        const alarmSettings = await getAlarmSettings();

        this.setState(HubStateType.Arming);

        const speaker = this.unitManager.getSpeaker();

        if (speaker)
        {
            speaker.playMultiTone();

            await sleep(200);

            for (let i = 0; i < alarmSettings.armDelay; i++)
            {
                if (this.hubState === HubStateType.Disarmed)
                    return;

                await sleep(1000);
                speaker.playTone();
            }
        }

        this.setState(HubStateType.Armed);
        this.selectedProfile = profile;

    }

    public async disarm()
    {
        this.setState(HubStateType.Disarmed);
        this.unitManager.ceaseSirens();

        await sleep(200);

        const speaker = this.unitManager.getSpeaker();

        speaker?.playMultiTone();

        createLog({ action: ActionType.Disarmed, source: Source.Hub, hubState: this.hubState });
    }

    public async alarm()
    {
        const alarmSettings = await getAlarmSettings();

        if (this.hubState === HubStateType.Alarm || this.hubState === HubStateType.Triggered)
            return;

        this.setState(HubStateType.Triggered);

        const speaker = this.unitManager.getSpeaker();

        if (speaker)
        {
            speaker.enableContinuousTone();

            for (let i = 0; i < alarmSettings.alarmDelay; i++)
            {
                if (this.hubState === HubStateType.Disarmed)
                {
                    return;
                }
                await sleep(1000);
            }

            speaker.disableContinuousTone();

            await sleep(200);
        }

        this.setState(HubStateType.Alarm);
        this.unitManager.fireSirens(this.selectedProfile);

        createLog({ action: ActionType.Armed, source: Source.Hub, hubState: this.hubState });
    }

    public async panic()
    {
        this.setState(HubStateType.Alarm);
        this.unitManager.fireSirens();


        createLog({ action: ActionType.Panicked, source: Source.Hub, hubState: this.hubState });
    }

}