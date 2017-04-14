var winston = require('winston');

module.exports = function errorHandler(err, req, res, next) {
    winston.info(err);
    res.status(500).json({'errorMessage': err.message,
        'errorName': err.name,
        'errorStack': err.stack,
        'errorCode': err.code,
        'originalError': err.originalError.message,
        'originalErrorStack': err.originalError.stack
    });
}
