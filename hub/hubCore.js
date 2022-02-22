const UnitManager = require('./unitManager');
const AlarmStateType = require('./alarmStateType');

let alarmState = AlarmStateType.DISARMED;

let unitManager = new UnitManager();

const init = () =>
{
    console.log("Initializing alarm");
    unitManager = new UnitManager();
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

unitManager.on('trigger', (unit) =>
{
    if (alarmState == AlarmStateType.ARMED)
    {
        alarmState = AlarmStateType.ALARM;
        alarm();
    }
});

unitManager.on('pong', (unit) =>
{
    unitManager.confirmPong(unit);
});

unitManager.on('offline', (unit) =>
{
    console.log(unit);
    console.log(`Lost connection with ${unit.id}`);
});

module.exports =
{
    init, arm, disarm, alarm
};


