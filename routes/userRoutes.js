const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.validate('createUser'), userController.registerUser);
router.post('/login', userController.validate('loginUser'), userController.loginUser);




module.exports = router;