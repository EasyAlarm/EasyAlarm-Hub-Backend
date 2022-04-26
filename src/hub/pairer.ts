import getNextNodeAddr from "../utils/getNextNodeAddr";
import sleep from "../utils/sleep";
import PayloadType from "./payloadType";
import UnitCommander from "./unitCommander";
import UnitManager from "./unitManager";

export enum PairingState
{
    IDLE,
    PAIRING,
    COMPLETE,
    FAILED
}

export default class Pairer 
{
    private deviceID: string;
    private readonly defaultNodeAddr: string = "1";
    private readonly timeout: number = 30;

    private state: PairingState = PairingState.IDLE;

    constructor(deviceID: string)
    {
        this.deviceID = deviceID;
    }

    public async waitForPairingRequest(): Promise<PairingState>
    {
        console.log("Waiting for pairing request...");

        UnitManager.getEvents().on(String(PayloadType.PAIR), async (incomingDeviceID: string) =>
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

        UnitManager.getEvents().removeAllListeners(String(PayloadType.PAIR));

        return this.state;
    }

    private async pairUnit(incomingDeviceID: string) 
    {
        this.state = PairingState.PAIRING;

        console.log("Pairing unit...");

        if (this.deviceID !== incomingDeviceID)
        {
            console.log("Unit IDs do not match");
            this.state = PairingState.FAILED;
            return;
        }

        const nodeAddr = await getNextNodeAddr();

        console.log(`Pairing unit ${this.deviceID} with ${nodeAddr}`);

        UnitCommander.send(this.defaultNodeAddr, PayloadType.OK, nodeAddr);

        this.state = PairingState.COMPLETE;

        console.log("Pairing complete");
    }
}