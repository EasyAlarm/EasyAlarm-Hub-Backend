const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/userModel');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");

const createSendToken = (user, res) =>
{
    const payload =
    {
        user:
        {
            id: user.id
        }
    };

    jwt.sign(payload, config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) =>
        {
            if (err) throw err;
            res.json({ token });
        }
    );
};


exports.registerUser = catchAsync(async (req, res, next) =>
{
    const errors = validationResult(req);

    if (!errors.isEmpty())
    {
        return next(new ApiError(errors.array()[0].msg, 400));
    }

    let hasAlreadyRegistered = await User.count() > 0;

    if (hasAlreadyRegistered)
        return next(new ApiError("You have already registered an account", 400));

    let user = new User
        ({
            username: req.body.username,
            password: req.body.password
        });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();

    createSendToken(user, res);

});

exports.loginUser = catchAsync(async (req, res, next) =>
{
    const errors = validationResult(req);

    if (!errors.isEmpty())
    {
        return next(new ApiError(errors.array()[0].msg, 400));
    }

    let user = await User.findOne({ username: req.body.username });

    if (!user)
    {
        return next(new ApiError("Invalid credentials", 400));
    }

    const isCorrectPassword = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrectPassword)
    {
        return next(new ApiError("Invalid credentials", 400));
    }

    createSendToken(user, res);
});

exports.validate = (method) =>
{
    switch (method)
    {
        case 'createUser':
            {
                return [
                    check('username', 'Username is required').not().isEmpty(),
                    check('password', 'Password is required').not().isEmpty(),
                    check('password', 'Please password with 6 or more characters').isLength({ min: 6 }),
                    check('password', 'Please password that is alphanumeric').isAlphanumeric()
                ];
            }
        case 'loginUser':
            {
                return [
                    check('username', 'Username is required').not().isEmpty(),
                    check('password', 'Password is required').not().isEmpty()
                ];
            }
    }
};