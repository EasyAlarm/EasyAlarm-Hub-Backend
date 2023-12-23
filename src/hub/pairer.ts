import { EventEmitter } from "stream";
import getNextNodeAddr from "../utils/getNextNodeAddr";
import sleep from "../utils/sleep";
import PayloadType from "./types/enums/payloadType";
import PendingUnit from "./units/pendingUnit";

export enum PairingState
{
    IDLE,
    PAIRING,
    COMPLETE,
    FAILED
}

export default class Pairer 
{
    private pendingUnit: PendingUnit;
    private eventEmitter: EventEmitter;

    private readonly defaultNodeAddr: string = "1";
    private readonly timeout: number = 30;

    private state: PairingState = PairingState.IDLE;

    constructor(pendingUnit: PendingUnit, eventEmitter: EventEmitter)
    {
        this.pendingUnit = pendingUnit;
        this.eventEmitter = eventEmitter;
    }

    public async waitForPairingRequest(): Promise<PairingState>
    {
        console.log("Waiting for pairing request...");

        this.eventEmitter.on(String(PayloadType.PAIR), async (incomingDeviceID: string) =>
        {
            this.pairUnit(incomingDeviceID);
        });

        let counter: number = 0;

        while (true)
        {
            counter++;

            await sleep(1000);

            if (this.state === PairingState.COMPLETE || this.state === PairingState.FAILED)
                break;

            if (this.state === PairingState.PAIRING)
                continue;

            if (counter >= this.timeout)
            {
                this.state = PairingState.FAILED;
                break;
            }

        }

        console.log("Pairing request timed out");

        this.eventEmitter.removeAllListeners(String(PayloadType.PAIR));

        return this.state;
    }

    private async pairUnit(incomingDeviceID: string) 
    {
        this.state = PairingState.PAIRING;

        console.log("Pairing unit...");

        if (this.pendingUnit.deviceID !== incomingDeviceID)
        {
            console.log("Unit IDs do not match");
            this.state = PairingState.FAILED;
            return;
        }

        const nodeAddr = await getNextNodeAddr();

        console.log(`Pairing unit ${this.pendingUnit.deviceID} with ${nodeAddr}`);

        this.pendingUnit.acknowledgePing(this.defaultNodeAddr);

        //give time for the unit to reset
        await sleep(3000);

        this.state = PairingState.COMPLETE;

        console.log("Pairing complete");
    }
}