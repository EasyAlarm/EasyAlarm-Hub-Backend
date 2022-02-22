const EventEmitter = require("events");
const serialHandler = require("./serialHandler");
const UnitMongoose = require('../models/unitModel');
const Unit = require('./unit');
const Ping = require('./ping');

module.exports = class UnitMonitor 
{
    #units = [];
    #pingPool = [];
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
        //serialHandler.write(`${unit.nodeAddress}!{}!!`);
    }

    confirmPong(unit)
    {
        this.#pingPool.foreach(ping =>
        {
            if (ping.getUnit().id === unit.id)
                ping.setHasReceivedPong(true);
        });
    }

    monitorSerial(serialData)
    {
        console.log(serialData);

        let deviceID = serialData[0];
        let payload = serialData[1];
        let content = serialData[2];

        for (let unit of this.#units)
        {
            console.log("emitting");
            console.log(payload);
            this.events.emit(payload, { unit });
            break;
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
                //this.#pingPool.push(new Ping(unit, this).start());
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