module.exports = function errorHandler(err, req, res, next) {
    var errorCode = err.code || 500;
    res.status(errorCode).send(err);
}
