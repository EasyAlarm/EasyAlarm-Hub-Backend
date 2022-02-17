const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/userModel');

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


exports.registerUser = async (req, res) =>
{
    try
    {
        const errors = validationResult(req);

        if (!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }

        let hasAlreadyRegistered = await User.count() > 0;

        if (hasAlreadyRegistered)
            return res.status(400).json({ errors: [{ msg: "You have already registered an account" }] });

        let user = await User.findOne({ username: req.body.username });

        if (user)
        {
            return res.status(400).json({ errors: [{ msg: "User already exists" }] });
        }

        user = new User
            ({
                username: req.body.username,
                password: req.body.password
            });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        await user.save();

        createSendToken(user, res);
    }
    catch (err)
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }

};

exports.loginUser = async (req, res, next) =>
{
    try
    {
        const errors = validationResult(req);

        if (!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }

        let user = await User.findOne({ username: req.body.username });

        if (!user)
        {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        const isCorrectPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isCorrectPassword)
        {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        createSendToken(user, res);
    }
    catch (err)
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }

};

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