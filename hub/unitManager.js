const EventEmitter = require("events");
const serialHandler = require("./serialHandler");
const UnitMongoose = require('../models/unitModel');
const Unit = require('./unit');
const Pinger = require('./pinger');
const PayloadType = require("./payloadType");

module.exports = class UnitMonitor 
{
    #units = [];
    #pingersPool = [];
    events = null;

    constructor()
    {
        this.monitorSerial = this.monitorSerial.bind(this);

        this.events = new EventEmitter();

        this.loadUnits();

        serialHandler.init(this.monitorSerial);
    }

    fire(unit)
    {
        serialHandler.write(`${unit.nodeAddress}!{}!!`);
    }

    cease(unit)
    {
        serialHandler.write(`${unit.nodeAddress}!{}!!`);
    }

    ping(unit)
    {
        console.log("pinging unit", unit.id);
        serialHandler.write(`${PayloadType.PING}!${unit.nodeAddress}!!`);
    }

    confirmPong(unit)
    {

        this.#pingersPool.forEach(pinger =>
        {
            if (pinger.getUnit().id === unit.id)
            {
                pinger.reset();
            }
        });
    }

    monitorSerial(serialData)
    {
        let deviceID = serialData[0];
        let payload = serialData[1];
        let content = serialData[2];

        for (let unit of this.#units)
        {
            if (unit.id === deviceID)
            {
                this.events.emit(payload, unit);
                break;
            }
        }
    };

    async loadUnits()
    {
        console.log("loading units");
        try
        {
            const filter = {};

            const unitsMongoose = await UnitMongoose.find(filter);

            unitsMongoose.forEach(unitMongoose =>
            {
                let unit = new Unit(unitMongoose.unitID, unitMongoose.unitType, unitMongoose.nodeAddress);

                this.#units.push(unit);
                let pinger = new Pinger(unit, this);
                pinger.start();
                this.#pingersPool.push(pinger);
            });

        }
        catch (error)
        {
            console.log(error);
        }


    };

    getUnits()
    {
        return this.#units;
    }
};