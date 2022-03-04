import { EventEmitter } from 'stream';
import { getAllUnits } from '../services/unitService';
import PayloadType from './payloadType';
import Unit from './unit';
import serialHandler = require('./serialHandler');
import Pinger from './pinger';
import PingerManager from './pingerManager';
import { any, unknown } from 'zod';
import sleep from '../utils/sleep';
import UnitCommander from './unitCommander';

export default class UnitManager
{
    private static instance: UnitManager;

    private units: Array<Unit>;
    private events: EventEmitter;

    private pingerManager: PingerManager;

    constructor()
    {
        this.monitorSerial = this.monitorSerial.bind(this);

        if (UnitManager.instance != null)
            throw new Error("Error, UnitManager is already initialized");

        UnitManager.instance = this;

        this.events = new EventEmitter();
        this.pingerManager = new PingerManager();

        this.units = [];
    }

    public async init(): Promise<void>
    {
        await this.reload();
        serialHandler.init(this.monitorSerial);
        this.pingerManager.init(this.units);

        console.log("UnitManager initialized");
    }

    public getPingerManager(): PingerManager
    {
        return this.pingerManager;
    }

    public static getEvents(): EventEmitter
    {
        return this.instance.events;
    }

    public static getUnits(): Array<Unit>
    {
        return this.instance.units;
    }

    public monitorSerial(serialData: Array<string>): void
    {
        let deviceID: string = serialData[0];
        let payload: PayloadType = PayloadType[serialData[1] as keyof typeof PayloadType];
        let content: string = serialData[2];

        console.log(`Received serial data: ${deviceID} ${PayloadType[payload]} ${String(PayloadType.PAIR)}`);

        if (PayloadType[payload] == String(PayloadType.PAIR))
        {
            console.log("received pair payload");
            this.events.emit(PayloadType[payload], deviceID);
            return;
        }

        this.units.forEach(unit => 
        {
            if (unit.getId() === deviceID)
            {
                this.events.emit(PayloadType[payload], unit);
            }
        });
    }

    private async reload(): Promise<void>
    {
        this.units = [];

        const unitModels = await getAllUnits();

        unitModels.forEach((unitModel: any) =>
        {
            this.units.push(new Unit(unitModel.unitID, unitModel.unitType, unitModel.nodeAddress));
        });


        this.pingerManager.clearPingers();
    }
}