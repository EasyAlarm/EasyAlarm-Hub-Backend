import { SerialPort } from "serialport";
import { BaseSerial } from "./baseSerial";

export class SerialWriter extends BaseSerial
{
    constructor(serialPort: SerialPort)
    {
        super(serialPort);
    }

    public write(data: string): void
    {
        this.serialPort.write(this.SOT + data + this.EOT);
    }
}