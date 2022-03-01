import { SerialPort, ReadlineParser } from 'serialport';
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });

const SOT = '<';
const EOT = '>';
const parser = port.pipe(new ReadlineParser({ delimiter: EOT }));

export const init = (handleDataCallback: Function) =>
{
    port.on("open", () =>
    {
        console.log('serial port open');
    });

    parser.on('data', (data: string) =>
    {
        data = data.split(SOT).pop() || '';

        let formatedData = data.split('!');

        handleDataCallback(formatedData);
    });
};

export const write = (data: string) =>
{
    port.write(SOT + data + EOT);
};

