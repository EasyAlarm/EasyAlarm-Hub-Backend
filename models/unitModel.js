const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema
    ({
        unitType:
        {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 16
        },
        friendlyName:
        {
            type: String,
            required: true,
            maxlength: 16,
            minlength: 3
        },
        unitID:
        {
            type: String,
            required: true,
            length: 9
        },
        nodeAddress:
        {
            type: String,
            required: true,
            length: 5
        }
    });


const Unit = mongoose.model('Unit', UnitSchema);
module.exports = Unit;