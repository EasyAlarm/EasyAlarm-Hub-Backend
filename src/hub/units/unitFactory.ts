import { SerialWriter } from "../serial/serialWriter";
import UnitType from "../types/enums/unitType";
import { IUnit } from "../types/interfaces/IUnit";
import DoorGuard from "./doorGuard";
import KeyFob from "./keyFob";
import MotionSense from "./motionSense";
import Rfid from "./rfid";
import Siren from "./siren";
import Unit from "./unit";

export default class UnitFactory 
{
    private serialWriter: SerialWriter;

    constructor(serialManager: SerialWriter)
    {
        this.serialWriter = serialManager;
    }

    public createUnit(unitModel: IUnit): Unit | null
    {
        switch (unitModel.type)
        {
            case UnitType.DOOR_GUARD:
                return new DoorGuard(unitModel, this.serialWriter);
            case UnitType.KEY_FOB:
                return new KeyFob(unitModel, this.serialWriter);
            case UnitType.MOTION_SENSE:
                return new MotionSense(unitModel, this.serialWriter);
            case UnitType.SIREN:
                return new Siren(unitModel, this.serialWriter);
            case UnitType.RFID:
                return new Rfid(unitModel, this.serialWriter);
        }

        return null;
    }
}