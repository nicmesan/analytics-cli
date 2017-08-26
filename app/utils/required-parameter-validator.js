var errors = require('../errors');
var _ = require('lodash');

exports.validateRequiredParameters = function (parameters) {

    let failedParameters = [];

    _.each(parameters, (parameterValue, parameterKey) => {
        if (_.isNil(parameterValue)) { //null or undefined
            failedParameters.push(parameterKey);
        }
    });

    if (failedParameters.length > 0) {
        throw errors.httpError("Parameters where required and where sent null: " + failedParameters.toString());
    };
};
