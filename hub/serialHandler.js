const SerialPort = require("serialport");
const ReadLine = require('@serialport/parser-readline');
const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
const parser = port.pipe(new ReadLine({ delimiter: '>' }));

const init = (handleDataCallback) =>
{
    port.on("open", () =>
    {
        console.log('serial port open');
    });

    parser.on('data', data =>
    {
        data = data.split('');
    });
};

const write = (data) =>
{
    port.write("<" + data + ">");
};

module.exports = { init, write };
