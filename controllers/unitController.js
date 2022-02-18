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
        if(!validateCheckCharacter(req.body.unitID))
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

};

exports.deleteUnit = async (req, res) =>
{

};

exports.getUnit = async (req, res) =>
{

};

exports.getAllUnits = async (req, res) =>
{

};