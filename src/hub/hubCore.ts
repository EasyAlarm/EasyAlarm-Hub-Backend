import { IUnit } from "../interfaces/IUnit";
import { SeverityType } from "../models/logModel";
import ProfileModel from "../models/profileModel";
import { createhubStateLog, createOfflineUnitLog, createSensorTriggeredLog } from "../services/logService";
import { setUnitOnlineStatus } from "../services/unitService";
import HubStateType from "./hubStateType";
import IHubStatus from "./IHubStatus";
import IProfile from "./IProfile";
import PayloadType from "./payloadType";
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
        UnitManager.getEvents().on("offline", (unit: IUnit) =>
        {
            console.log(`Unit ${unit.deviceID} is offline`);
            createOfflineUnitLog(unit);
            setUnitOnlineStatus(unit.deviceID, false);
        });

        UnitManager.getEvents().on(String(PayloadType.PONG), (unit: IUnit) =>
        {
            this.unitManager.getPingerManager().confirmPong(unit);
            setUnitOnlineStatus(unit.deviceID, true);
        });

        UnitManager.getEvents().on(String(PayloadType.TRIGGERED), (unit: IUnit) =>
        {
            this.handleTrigger(unit);
        });
    }

    private static handleTrigger(unit: IUnit): void
    {
        if (this.hubState == HubStateType.DISARMED)
            return;

        if (!this.selectedProfile.unitIDS.some(u => u === unit.deviceID))
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


