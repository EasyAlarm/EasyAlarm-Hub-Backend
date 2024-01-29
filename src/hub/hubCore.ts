import { IUnit } from "./types/interfaces/IUnit";
import ProfileModel from "../models/profileModel";
import { createLog } from "../services/logService";
import { setUnitOnlineStatus } from "../services/unitService";
import HubStateType from "./types/enums/hubStateType";
import IHubStatus from "./types/interfaces/IHubStatus";
import PayloadType from "./types/enums/payloadType";
import UnitManager from "./unitManager";
import SerialMonitor from "./serial/serialMonitor";
import EventEmitter from "events";
import PingerManager from "./pingerManager";
import AlarmSystem from "./alarmSystem";
import Pairer from "./pairer";
import UnitFactory from "./units/unitFactory";
import { SerialPort } from "serialport";
import { SerialWriter } from "./serial/serialWriter";
import PendingUnit from "./units/pendingUnit";
import Unit from "./units/unit";
import KeyFob from "./units/keyFob";
import { KeyFobContentType } from "./types/enums/payloadContentTypes";
import { isValidRfidCard } from "../services/rfidService";
import Rfid from "./units/rfid";
import { ActionType } from "../models/logModel";

export default class HubCore
{
    private static instance: HubCore;

    private serialMonitor: SerialMonitor;
    private serialWriter: SerialWriter;

    private eventEmitter: EventEmitter;

    private pingerManager: PingerManager;
    private alarmSystem: AlarmSystem;
    private unitManager: UnitManager;


    private constructor()
    {
        const serialPort = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
        this.serialWriter = new SerialWriter(serialPort);
        this.unitManager = new UnitManager(new UnitFactory(this.serialWriter));

        this.eventEmitter = new EventEmitter();
        this.serialMonitor = new SerialMonitor(serialPort, this.eventEmitter, this.unitManager.getUnits());

        this.pingerManager = new PingerManager(this.eventEmitter);
        this.alarmSystem = new AlarmSystem(this.unitManager);
    }

    public static getInstance(): HubCore 
    {
        if (!HubCore.instance)
        {
            HubCore.instance = new HubCore();
        }

        return HubCore.instance;
    }

    public async init(): Promise<void>
    {
        await this.unitManager.reload();
        this.pingerManager.init(this.unitManager.getUnits());

        this.serialMonitor.establishCommunication();

        this.eventHandler();

        console.log("HubCore initialized");
    }

    public getAlarmSystem(): AlarmSystem
    {
        return this.alarmSystem;
    }

    public createPairer(deviceID: string): Pairer
    {
        const pendingUnit = new PendingUnit(deviceID, this.serialWriter);
        return new Pairer(pendingUnit, this.eventEmitter);
    }

    public async reload(): Promise<void>
    {
        await this.unitManager.reload();
        this.pingerManager.reloadPingers(this.unitManager.getUnits());
    }

    public getStatus(): IHubStatus
    {
        const currentProfile = this.alarmSystem.getCurentProfile();
        const hubState = this.alarmSystem.getState();

        return {
            state: HubStateType[hubState],
            currentProfile: hubState === HubStateType.Armed ? currentProfile.name : "None"
        };
    }

    private eventHandler(): void
    {
        this.eventEmitter.on("offline", (unit: Unit) =>
        {
            console.log(`Unit ${unit.deviceID} is offline`);

            if (unit.online)
            {
                //createOfflineUnitLog(unit);
            }

            setUnitOnlineStatus(unit.deviceID, false);
        });

        this.eventEmitter.on(String(PayloadType.PONG), (unit: Unit) =>
        {
            this.pingerManager.confirmPong(unit);
            setUnitOnlineStatus(unit.deviceID, true);
        });

        this.eventEmitter.on(String(PayloadType.TRIGGERED), (unit: Unit, content: string) =>
        {
            if (unit instanceof KeyFob)
            {
                this.handleKeyFob(content);
                return;
            }
            else if (unit instanceof Rfid)
            {
                this.handleRfid(content);
                return;
            }

            this.handleTrigger(unit);
        });
    }

    private async handleRfid(content: string): Promise<void>
    {
        const isValid = await isValidRfidCard(content);

        if (!isValid)
        {
            return;
        }

        if (this.alarmSystem.getState() === HubStateType.Disarmed) 
        {
            const lockdownProfile = await ProfileModel.findOne({ name: "Lockdown" });
            this.alarmSystem.arm(lockdownProfile);
        }
        else
        {
            this.alarmSystem.disarm();
        }
    }

    private handleTrigger(unit: IUnit): void
    {

        if (this.alarmSystem.getState() !== HubStateType.Armed)
            return;

        if (!this.alarmSystem.getCurentProfile().unitIDS.find(u => u.toString() === unit._id.toString()))
        {
            return;
        }

        createLog({ action: ActionType.Triggered, source: unit.type, friendlyName: unit.friendlyName, hubState: this.alarmSystem.getState() });

        this.alarmSystem.alarm();
    }

    private async handleKeyFob(content: string): Promise<void>
    {
        switch (content)
        {
            case KeyFobContentType.DISARM:
                this.alarmSystem.disarm();
                break;
            case KeyFobContentType.ARM_LOCKDOWN:
                const lockdownProfile = await ProfileModel.findOne({ name: "Lockdown" });
                this.alarmSystem.arm(lockdownProfile);
                break;
            case KeyFobContentType.ARM_NIGHT:
                const panicProfile = await ProfileModel.findOne({ name: "Night" });
                this.alarmSystem.arm(panicProfile);
                break;
            case KeyFobContentType.PANIC:
                this.alarmSystem.panic();
                break;
            default:
                break;
        }
    }

}
