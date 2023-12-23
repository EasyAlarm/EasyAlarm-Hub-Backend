import { SerialPort } from 'serialport';

export abstract class BaseSerial
{
    protected serialPort: SerialPort;
    protected readonly SOT: string = '<';
    protected readonly EOT: string = '>';

    constructor(serialPort: SerialPort)
    {
        this.serialPort = serialPort;
    }
}
