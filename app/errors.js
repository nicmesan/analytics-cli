exports.httpError = function(customMessage, originalError) {
    var err = new Error(customMessage);
    err.originalError = originalError;
    return err;
};
