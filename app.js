const express = require('express');

const userRouter = require('./routes/userRoutes');

const { protect } = require('./middleware/auth');

const app = express();


//Middlewares
app.use(express.json({ extended: false }));

//Routes
app.use('/api/user', userRouter);

app.get('/', protect, (req, res) => res.send('Auth route'));

app.all('*', (req, res, next) =>
{
    res.status(404).json({
        message: 'Route not found'
    });
});

module.exports = app;
