import { SerialPort, ReadlineParser } from 'serialport';
import { EventEmitter } from "stream";
import PayloadType from "../types/enums/payloadType";
import { BaseSerial } from './baseSerial';
import Unit from '../units/unit';

export default class SerialMonitor extends BaseSerial
{
    private eventEmitter: EventEmitter;
    private parser: ReadlineParser;

    private units: Array<Unit>;

    constructor(serialPort: SerialPort, eventEmitter: EventEmitter, units: Array<Unit>)
    {
        super(serialPort);

        this.eventEmitter = eventEmitter;
        this.parser = this.serialPort.pipe(new ReadlineParser({ delimiter: this.EOT }));

        this.units = units;
    }


    public establishCommunication(): void
    {
        this.serialPort.on("open", () =>
        {
            console.log('serial port open');
        });

        this.parser.on('data', (data: string) =>
        {

            data = data.split(this.SOT).pop() || '';

            let formatedData = data.split('!');

            this.monitorSerial(formatedData);
        });
    }


    private monitorSerial(serialData: Array<string>): void
    {
        let deviceID: string = serialData[0];
        let payload: PayloadType = PayloadType[serialData[1] as keyof typeof PayloadType];
        let content: string = serialData[2];

        console.log(`Received serial data: ${deviceID} ${payload}`);

        if (PayloadType[payload] == String(PayloadType.PAIR))
        {
            console.log("received pair payload");
            this.eventEmitter.emit(PayloadType[payload], deviceID);
            return;
        }

        this.units.forEach(unit => 
        {
            if (unit.deviceID === deviceID)
            {
                this.eventEmitter.emit(PayloadType[payload], unit, content);
            }
        });
    }
}