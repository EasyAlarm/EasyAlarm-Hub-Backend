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
    private unitID: string;
    private readonly defaultNodeAddr: string = "01";
    private readonly timeout: number = 30;

    private state: PairingState = PairingState.IDLE;

    constructor(unitID: string)
    {
        this.unitID = unitID;
    }

    public async waitForPairingRequest(): Promise<PairingState>
    {
        console.log("Waiting for pairing request...");

        UnitManager.getEvents().on(String(PayloadType.PAIR), async (incomingUnitID: string) =>
        {
            this.pairUnit(incomingUnitID);
        });

        let counter: number = 0;

        while (true)
        {
            await sleep(1000);

            if (this.state === PairingState.COMPLETE || this.state === PairingState.FAILED)
                break;

            if (this.state === PairingState.PAIRING || this.state === PairingState.IDLE)
                continue;

            if (counter >= this.timeout)
            {
                this.state = PairingState.FAILED;
                break;
            }

            counter++;
        }

        console.log("Pairing request timed out");

        UnitManager.getEvents().removeAllListeners(String(PayloadType.PAIR));

        return this.state;
    }

    private async pairUnit(incomingUnitID: string) 
    {
        this.state = PairingState.PAIRING;

        console.log("Pairing unit...");

        if (this.unitID !== incomingUnitID)
        {
            console.log("Unit IDs do not match");
            this.state = PairingState.FAILED;
            return;
        }

        const nodeAddr = await getNextNodeAddr();

        console.log(`Pairing unit ${this.unitID} with ${nodeAddr}`);

        UnitCommander.send(this.defaultNodeAddr, PayloadType.OK, nodeAddr);

        this.state = PairingState.COMPLETE;

        console.log("Pairing complete");
    }
}