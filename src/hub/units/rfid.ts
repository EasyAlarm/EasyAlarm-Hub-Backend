import { SerialWriter } from "../serial/serialWriter";
import { IUnit } from "../types/interfaces/IUnit";
import Unit from "./unit";

export default class Rfid extends Unit
{
    public isPingable(): boolean
    {
        return true;
    }

    constructor(unit: IUnit, serialWriter: SerialWriter)
    {
        super(unit, serialWriter);
    }
}