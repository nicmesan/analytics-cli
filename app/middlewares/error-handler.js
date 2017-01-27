module.exports = function errorHandler(err, req, res, next) {
    res.status(500).send('error', { error: err });
}
