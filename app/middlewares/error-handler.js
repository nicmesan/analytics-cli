module.exports = function errorHandler(err, req, res, next) {
    console.log('middleware error', err)
    console.log('I the error handler');
    res.status(500).json({'errorMessage': err.message,
        'errorName': err.name,
        'errorStack': err.stack,
        'errorCode': err.code,
        'originalError': err.originalError.message,
        'originalErrorStack': err.originalError.stack
    });
}
