import { SeverityType } from "../models/logModel";
import { createhubStateLog, createOfflineUnitLog } from "../services/logService";
import { setUnitOnlineStatus } from "../services/unitService";
import HubStateType from "./hubStateType";
import PayloadType from "./payloadType";
import Unit from "./unit";
import UnitManager from "./unitManager";

export default class HubCore
{
    private static hubState: HubStateType;
    private static unitManager: UnitManager;

    public static setState(state: HubStateType): void
    {
        this.hubState = state;
        createhubStateLog(state);
    }

    private constructor() { };

    public static async init(): Promise<void>
    {
        this.unitManager = new UnitManager();

        await this.unitManager.init();

        this.eventHandler();

        console.log("HubCore initialized");
    }

    public static GetUnitManager(): UnitManager
    {
        return this.unitManager;
    }

    private static eventHandler(): void
    {
        UnitManager.getEvents().on("offline", (unit: Unit) =>
        {
            console.log(`Unit ${unit.getId()} is offline`);
            createOfflineUnitLog(unit);
            setUnitOnlineStatus(unit.getId(), false);
        });

        UnitManager.getEvents().on(String(PayloadType.PONG), (unit: Unit) =>
        {
            this.unitManager.getPingerManager().confirmPong(unit);
            setUnitOnlineStatus(unit.getId(), true);
        });
    }

}


