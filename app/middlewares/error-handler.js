module.exports = function errorHandler(err, req, res, next) {
    console.log('I the error handler');
    var errorCode = err.code || 500;
    res.status(errorCode).json({error: err});
}
