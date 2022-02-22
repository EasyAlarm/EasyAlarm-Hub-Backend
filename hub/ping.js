const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = class Ping
{
    #unit = null;
    #unitManager = null;

    #hasReceivedPong = false;
    #failedPingCounter = 0;
    #failedPingThreshold = 3;
    #delay = 3;
    #shouldPing = true;

    constructor(unit, unitManager)
    {
        this.#unit = unit;
        this.#unitManager = unitManager;
    }

    setHasReceivedPong(value)
    {
        this.#hasReceivedPong = true;
    }

    getUnit()
    {
        return this.#unit;
    }

    reset()
    {
        this.#failedPingCounter = 0;
    }

    async start()
    {
        while (this.#shouldPing)
        {
            this.#unitManager.ping(this.#unit);

            await sleep(1000 * this.#delay);

            if (this.#hasReceivedPong)
            {
                this.reset();
                continue;
            }

            this.#failedPingCounter++;

            if (this.#failedPingCounter >= this.#failedPingThreshold)
            {
                this.#unitManager.emit('offline', this.#unit);
            }
        }
    }
};