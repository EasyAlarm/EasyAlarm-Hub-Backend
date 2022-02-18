exports.errorHandler = ((err, req, res, next) =>
{
    err.statusCode = err.statusCode || 500;


    if (err.statusCode == 500)
    {
        console.log(err);
        err.message = "Internal Server Error";
    }

    res.status(err.statusCode).json({
        errors: [{ msg: err.message }]
    });
});