const UnitManager = require('./unitManager');
const AlarmStateType = require('./alarmStateType');
const PayloadType = require('./payloadType');

let alarmState = AlarmStateType.DISARMED;

const unitManager = new UnitManager();

const init = () =>
{
    console.log("Initializing alarm");
};

const arm = () =>
{
    alarmState = AlarmStateType.ARMED;
};

const disarm = () =>
{
    unitManager.getUnits().foreach(unit =>
    {
        if (unit.type == "siren")
        {
            cease(unit);
        }
    });
};

const alarm = () =>
{
    unitManager.getUnits().forEach(unit =>
    {
        if (unit.type == "siren")
        {
            fire(unit);
        }
    });
};

unitManager.events.on(PayloadType.TRIGGERED, (unit) =>
{
    if (alarmState == AlarmStateType.ARMED)
    {
        alarmState = AlarmStateType.ALARM;
        alarm();
    }
});

unitManager.events.on(PayloadType.PONG, (unit) =>
{
    unitManager.confirmPong(unit);
});

unitManager.events.on(PayloadType.PAIR, (unit) =>
{
    console.log("unit wants to pair");
});

unitManager.events.on('offline', (unit) =>
{
    console.log(unit);
    console.log(`Lost connection with ${unit.id}`);
});

module.exports =
{
    init, arm, disarm, alarm
};


