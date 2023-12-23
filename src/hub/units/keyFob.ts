import { SerialWriter } from "../serial/serialWriter";
import { IUnit } from "../types/interfaces/IUnit";
import Unit from "./unit";

export default class KeyFob extends Unit
{
    public isPingable(): boolean
    {
        return false;
    }

    constructor(unit: IUnit, serialWriter: SerialWriter)
    {
        super(unit, serialWriter);
    }
}