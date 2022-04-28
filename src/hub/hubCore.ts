import { IUnit } from "../interfaces/IUnit";
import { SeverityType } from "../models/logModel";
import ProfileModel from "../models/profileModel";
import { createhubStateLog, createOfflineUnitLog, createSensorTriggeredLog } from "../services/logService";
import { getUnit, setUnitOnlineStatus } from "../services/unitService";
import HubStateType from "./hubStateType";
import IHubStatus from "./IHubStatus";
import IProfile from "./IProfile";
import PayloadType from "./payloadType";
import UnitManager from "./unitManager";

export default class HubCore
{
    private static hubState: HubStateType;
    public static selectedProfile: IProfile;
    private static _unitManager: UnitManager;

    public static setState(state: HubStateType): void
    {
        this.hubState = state;
        createhubStateLog(state);
    }

    private constructor() { };

    public static async init(): Promise<void>
    {
        this._unitManager = new UnitManager();

        await this._unitManager.init();

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
        this._unitManager.ceaseSirens();
    }

    public static async alarm()
    {
        if (this.hubState === HubStateType.ALARM)
            return;

        this.setState(HubStateType.ALARM);
        this._unitManager.fireSirens(this.selectedProfile);

    }

    public static async panic()
    {
        this.setState(HubStateType.ALARM);
        this._unitManager.fireSirens();
    }

    public static get unitManager(): UnitManager
    {
        return this._unitManager;
    }

    private static eventHandler(): void
    {
        this._unitManager.getEvents().on("offline", (unit: IUnit) =>
        {
            console.log(`Unit ${unit.deviceID} is offline`);
            createOfflineUnitLog(unit);
            setUnitOnlineStatus(unit.deviceID, false);
        });

        this._unitManager.getEvents().on(String(PayloadType.PONG), (unit: IUnit) =>
        {
            this._unitManager.getPingerManager().confirmPong(unit);
            setUnitOnlineStatus(unit.deviceID, true);
        });

        this._unitManager.getEvents().on(String(PayloadType.TRIGGERED), (unit: IUnit, content: string) =>
        {
            if (unit.type === "KeyFob")
            {
                this.handleKeyFob(content);
                return;
            }

            this.handleTrigger(unit);
        });
    }

    private static handleTrigger(unit: IUnit): void
    {

        if (this.hubState == HubStateType.DISARMED)
            return;

        console.log(this.selectedProfile.unitIDS);

        if (!this.selectedProfile.unitIDS.find(u => u.toString() === unit._id.toString()))
        {
            return;
        }

        createSensorTriggeredLog(unit);
        this.alarm();
    }

    private static async handleKeyFob(content: string): Promise<void>
    {
        switch (content)
        {
            case "0":
                this.disarm();
                break;
            case "1":
                const lockdownProfile = await ProfileModel.findOne({ name: "Lockdown" });
                this.arm(lockdownProfile);
                break;
            case "2":
                const panicProfile = await ProfileModel.findOne({ name: "Night" });
                this.arm(panicProfile);
                break;
            case "3":
                this.panic();
                break;
            default:
                break;
        }
    }

    public static getStatus(): IHubStatus
    {
        return {
            state: HubStateType[this.hubState],
            currentProfile: this.hubState === HubStateType.ARMED ? this.selectedProfile.name : "None"
        };
    }

}


