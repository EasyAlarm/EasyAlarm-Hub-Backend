const config = require('config');

const Unit = require('../models/unitModel');
const { validateCheckCharacter } = require('../utils/luhnValidator');

const getUnitType = (deviceID) => 
{
    let firstChar = deviceID.charAt(0);

    let dict =
    {
        a: "DoorGuard",
        b: "MotionSensor",
        c: "Siren"
    };

    return dict[firstChar];
};

exports.addUnit = async (req, res) =>
{
    try
    {
        if (!validateCheckCharacter(req.body.unitID))
        {
            return res.status(400).send("Invalid device id");
        }

        let unit = await Unit.findOne({ unitID: req.body.unitID });

        if (unit)
        {
            return res.status(400).send('Unit already exists');
        }

        unit = new Unit
            ({
                unitType: getUnitType(req.body.unitID),
                friendlyName: req.body.friendlyName,
                unitID: req.body.unitID
            });


        await unit.save();

        return res.status(201).send('Unit added');
    }
    catch (err)
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateUnit = async (req, res) =>
{
    try 
    {
        const filter = { unitID: req.params.unitID };
        const update = { friendlyName: req.body.friendlyName };

        await Unit.findOneAndUpdate(filter, update,
            {
                new: true,
                runValidators: true
            });

        return res.status(201).send('Unit updated');
    }
    catch (err)
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteUnit = async (req, res) =>
{
    try
    {
        const filter = { unitID: req.params.unitID };

        const doc = await Unit.findOneAndDelete(filter);

        if (!doc)
        {
            //404 error
        }

        res.status(204).send("Deleted");
    }
    catch (err)
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUnit = async (req, res) =>
{
    try
    {
        const filter = { unitID: req.params.unitID };

        const doc = await Unit.findOne(filter);

        res.status(200).send({ data: doc });
    }
    catch (err)
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllUnits = async (req, res) =>
{
    try
    {
        const filter = {};

        const doc = await Unit.find(filter);

        res.status(200).send({ data: doc });
    }
    catch (err)
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};