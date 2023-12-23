import { SerialWriter } from "../serial/serialWriter";
import { SirenContentType } from "../types/enums/payloadContentTypes";
import PayloadType from "../types/enums/payloadType";
import { IUnit } from "../types/interfaces/IUnit";
import Unit from "./unit";

export default class Siren extends Unit
{
    public isPingable(): boolean
    {
        return true;
    }

    constructor(unit: IUnit, serialWriter: SerialWriter)
    {
        super(unit, serialWriter);
    }

    public startBuzzer()
    {
        this.processPayload(PayloadType.FIRE, SirenContentType.BUZZER);
    }

    public stopBuzzer()
    {
        this.processPayload(PayloadType.CEASE, SirenContentType.BUZZER);
    }

    public enableContinuousTone()
    {
        this.processPayload(PayloadType.FIRE, SirenContentType.ENABLE_CONTINUOUS_TONE);
    }

    public disableContinuousTone()
    {
        this.processPayload(PayloadType.FIRE, SirenContentType.DISABLE_CONTINUOUS_TONE);
    }

    public playMultiTone()
    {
        this.processPayload(PayloadType.FIRE, SirenContentType.MULTI_TONE);
    }

    public playTone()
    {
        this.processPayload(PayloadType.FIRE, SirenContentType.TONE);
    }
}