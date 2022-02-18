const express = require('express');
const unitController = require('../controllers/unitController');

const router = express.Router();

router
    .route('/')
    .get(unitController.getAllUnits)
    .post(unitController.addUnit);

router
    .route('/:unitID')
    .get(unitController.getUnit)
    .patch(unitController.updateUnit)
    .delete(unitController.deleteUnit);

module.exports = router;