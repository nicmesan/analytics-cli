var winston = require('winston');

module.exports = function errorHandler(err, req, res, next) {
    winston.error('analytics-cli error', err);

    var errorToSend = {
        errorMessage: err.message,
        errorName: err.name,
        errorStack: err.stack,
        errorCode: err.code
    };

    if (err.originalError) {
        Object.assign(errorToSend, {
            originalError: err.originalError.message,
            originalErrorStack: err.originalError.stack
        })
    }

    res.status(500).json(errorToSend);
};
