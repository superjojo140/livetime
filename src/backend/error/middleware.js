module.exports.notFoundRoute = function (req, res, next) {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
}

module.exports.errorHandler = function (error, req, res, next) {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            status: error.status || 500
        }
    });
}