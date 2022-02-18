const config = require('config');

const Unit = require('../models/unitModel');
const ApiError = require('../utils/apiError');
const { validateCheckCharacter } = require('../utils/luhnValidator');
const catchAsync = require('./../utils/catchAsync');

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

exports.addUnit = catchAsync(async (req, res, next) =>
{
    if (!validateCheckCharacter(req.body.unitID))
    {
        return next(new ApiError('Invalid unit ID', 400));
    }

    let unit = await Unit.findOne({ unitID: req.body.unitID });

    if (unit)
    {
        return next(new ApiError('Unit already exists', 400));
    }

    unit = new Unit
        ({
            unitType: getUnitType(req.body.unitID),
            friendlyName: req.body.friendlyName,
            unitID: req.body.unitID
        });


    await unit.save();

    return res.status(201).send('Unit added');
});

exports.updateUnit = catchAsync(async (req, res, next) =>
{
    const filter = { unitID: req.params.unitID };
    const update = { friendlyName: req.body.friendlyName };

    const unit = await Unit.findOneAndUpdate(filter, update,
        {
            new: true,
            runValidators: true
        });

    if (!unit)
        return next(new ApiError('Unit not found', 404));

    return res.status(201).send('success');
});

exports.deleteUnit = catchAsync(async (req, res, next) =>
{
    const filter = { unitID: req.params.unitID };

    const unit = await Unit.findOneAndDelete(filter);

    if (!unit)
        return next(new ApiError('Unit not found', 404));

    res.status(204).send("success");
});

exports.getUnit = catchAsync(async (req, res, next) =>
{
    const filter = { unitID: req.params.unitID };

    const unit = await Unit.findOne(filter);

    if (!unit)
        return next(new ApiError('Unit not found', 404));

    res.status(200).send({ data: unit });
});

exports.getAllUnits = catchAsync(async (req, res, next) =>
{
    const filter = {};

    const units = await Unit.find(filter);

    res.status(200).send({ data: units });
});