import { SeverityType } from "../models/logModel";
import ProfileModel from "../models/profileModel";
import { createhubStateLog, createOfflineUnitLog, createSensorTriggeredLog } from "../services/logService";
import { setUnitOnlineStatus } from "../services/unitService";
import HubStateType from "./hubStateType";
import IHubStatus from "./IHubStatus";
import IProfile from "./IProfile";
import PayloadType from "./payloadType";
import Unit from "./unit";
import UnitManager from "./unitManager";

export default class HubCore
{
    private static hubState: HubStateType;
    public static selectedProfile: IProfile;
    private static unitManager: UnitManager;

    public static setState(state: HubStateType): void
    {
        this.hubState = state;
        createhubStateLog(state);
    }

    private constructor() { };

    public static async init(): Promise<void>
    {
        this.unitManager = new UnitManager();

        await this.unitManager.init();

        this.eventHandler();

        this.hubState = HubStateType.DISARMED;

        console.log("HubCore initialized");
    }

    public static async arm(profile: IProfile)
    {
        this.setState(HubStateType.ARMED);
        this.selectedProfile = profile;
    }

    public static async disarm()
    {
        this.setState(HubStateType.DISARMED);
        this.unitManager.ceaseSirens();
    }

    public static async alarm()
    {
        if (this.hubState === HubStateType.ALARM)
            return;

        this.setState(HubStateType.ALARM);
        this.unitManager.fireSirens(this.selectedProfile);

    }

    public static async panic()
    {
        this.setState(HubStateType.ALARM);
        this.unitManager.fireSirens();
    }

    public static GetUnitManager(): UnitManager
    {
        return this.unitManager;
    }

    private static eventHandler(): void
    {
        UnitManager.getEvents().on("offline", (unit: Unit) =>
        {
            console.log(`Unit ${unit.getId()} is offline`);
            createOfflineUnitLog(unit);
            setUnitOnlineStatus(unit.getId(), false);
        });

        UnitManager.getEvents().on(String(PayloadType.PONG), (unit: Unit) =>
        {
            this.unitManager.getPingerManager().confirmPong(unit);
            setUnitOnlineStatus(unit.getId(), true);
        });

        UnitManager.getEvents().on(String(PayloadType.TRIGGERED), (unit: Unit) =>
        {
            this.handleTrigger(unit);
        });
    }

    private static handleTrigger(unit: Unit): void
    {
        if (this.hubState == HubStateType.DISARMED)
            return;

        if (!this.selectedProfile.unitIDS.some(u => u === unit.getId()))
        {
            return;
        }

        createSensorTriggeredLog(unit);
        this.alarm();
    }

    public static getStatus(): IHubStatus
    {
        return {
            state: HubStateType[this.hubState],
            currentProfile: this.hubState === HubStateType.ARMED ? this.selectedProfile.name : "None"
        };
    }

}


