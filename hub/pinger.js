const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = class Pinger
{
    #unit = null;
    #unitManager = null;

    #failedPingCounter = 0;
    #failedPingThreshold = 3;
    #delay = 3;
    #shouldPing = true;

    constructor(unit, unitManager)
    {
        this.#unit = unit;
        this.#unitManager = unitManager;
    }

    getUnit()
    {
        return this.#unit;
    }

    reset()
    {
        this.setHasReceivedPong = false;
        this.#failedPingCounter = 0;
    }

    async start()
    {
        while (this.#shouldPing)
        {
            this.#unitManager.ping(this.#unit);

            await sleep(1000 * this.#delay);

            this.#failedPingCounter++;

            if (this.#failedPingCounter >= this.#failedPingThreshold)
            {
                this.#unitManager.events.emit('offline', this.#unit);
            }
        }
    }
};