import { IUnit } from "../interfaces/IUnit";
import { SeverityType } from "../models/logModel";
import ProfileModel from "../models/profileModel";
import { createhubStateLog, createOfflineUnitLog, createSensorTriggeredLog } from "../services/logService";
import { getUnit, setUnitOnlineStatus } from "../services/unitService";
import sleep from "../utils/sleep";
import HubStateType from "./hubStateType";
import IHubSettings from "./IHubSettings";
import IHubStatus from "./IHubStatus";
import IProfile from "./IProfile";
import PayloadType from "./payloadType";
import UnitCommander from "./unitCommander";
import UnitManager from "./unitManager";

export default class HubCore
{
    private static hubState: HubStateType;
    public static selectedProfile: IProfile;
    private static _unitManager: UnitManager;

    private static hubSettings: IHubSettings;

    public static setState(state: HubStateType): void
    {
        this.hubState = state;
        createhubStateLog(state);
    }

    public static getSettings(): IHubSettings
    {
        return this.hubSettings;
    }

    public static setSettings(hubSettings: IHubSettings): void
    {
        this.hubSettings = hubSettings;
    }

    private constructor() { };

    public static async init(): Promise<void>
    {
        this.hubSettings = {
            armDelay: 10,
            alarmDelay: 5,
            alarmDuration: 360,
            alarmOnOfflineUnit: false
        };


        this._unitManager = new UnitManager();

        await this._unitManager.init();

        this.eventHandler();

        this.hubState = HubStateType.DISARMED;

        console.log("HubCore initialized");
    }

    public static async arm(profile: IProfile)
    {
        this.setState(HubStateType.ARMING);

        const speaker = this._unitManager.getSpeaker();

        if (speaker)
        {
            UnitCommander.send(speaker, PayloadType.FIRE, "1");

            await sleep(200);

            for (let i = 0; i < this.hubSettings.armDelay; i++)
            {
                if (this.hubState === HubStateType.DISARMED)
                    return;

                await sleep(1000);
                UnitCommander.send(speaker, PayloadType.FIRE, "2");
            }
        }

        this.setState(HubStateType.ARMED);
        this.selectedProfile = profile;
    }

    public static async disarm()
    {
        this.setState(HubStateType.DISARMED);
        this._unitManager.ceaseSirens();

        await sleep(200);

        const speaker = this._unitManager.getSpeaker();

        if (speaker)
            UnitCommander.send(speaker, PayloadType.FIRE, "1");
    }

    public static async alarm()
    {
        if (this.hubState === HubStateType.ALARM || this.hubState === HubStateType.TRIGGERED)
            return;

        this.setState(HubStateType.TRIGGERED);

        const speaker = this._unitManager.getSpeaker();

        if (speaker)
        {
            UnitCommander.send(speaker, PayloadType.FIRE, "3");
            for (let i = 0; i < this.hubSettings.alarmDelay; i++)
            {
                if (this.hubState === HubStateType.DISARMED)
                {
                    return;
                }
                await sleep(1000);
            }
            UnitCommander.send(speaker, PayloadType.FIRE, "4");
            await sleep(200);
        }

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

        if (this.hubState !== HubStateType.ARMED)
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


