import AlarmStateType from "./alarmStateType";
import PayloadType from "./payloadType";
import Unit from "./unit";
import UnitManager from "./unitManager";

export default class HubCore
{
    private static alarmState: AlarmStateType;
    private static unitManager: UnitManager;

    public arm(): void
    {
        AlarmStateType.ARMED;
    }

    public disarm(): void
    {
        AlarmStateType.DISARMED;
    }

    public alamar(): void
    {
        AlarmStateType.ALARM;
    }

    public static async init(): Promise<void>
    {

        this.alarmState = AlarmStateType.DISARMED;
        this.unitManager = new UnitManager();

        await this.unitManager.init();

        this.eventHandler();

        console.log("HubCore initialized");
    }

    private static eventHandler(): void
    {
        UnitManager.getEvents().on("offline", (unit: Unit) =>
        {
            console.log(`Unit ${unit.getId()} is offline`);
        });

        UnitManager.getEvents().on(String(PayloadType.PONG), (unit: Unit) =>
        {
            this.unitManager.GetPingerManager().confirmPong(unit);
        });
    }

}


