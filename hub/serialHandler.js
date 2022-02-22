const { SerialPort, ReadlineParser } = require('serialport');
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });

const SOT = '<';
const EOT = '>';
const parser = port.pipe(new ReadlineParser({ delimiter: EOT }));

const init = (handleDataCallback) =>
{
    port.on("open", () =>
    {
        console.log('serial port open');
    });

    parser.on('data', data =>
    {
        data = data.split(SOT).pop();

        formatedData = data.split('!');

        handleDataCallback(formatedData);
    });
};

const write = (data) =>
{
    port.write(SOT + data + EOT);
};

module.exports = { init, write };
