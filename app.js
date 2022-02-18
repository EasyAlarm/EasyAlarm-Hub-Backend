const express = require('express');

const userRouter = require('./routes/userRoutes');
const unitRouter = require('./routes/unitRoutes');
const { protect } = require('./middleware/auth');
const ApiError = require('./utils/apiError');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();


//Middlewares
app.use(express.json({ extended: false }));

//Routes
app.use('/api/user', userRouter);
app.use('/api/unit', unitRouter);

app.get('/', protect, (req, res) => res.send('Auth route'));

app.all('*', (req, res, next) =>
{
    // res.status(404).json({
    //     message: 'Route not found'
    // });


    next(new ApiError("Route not found", 404));
});

app.use(errorHandler);

module.exports = app;
