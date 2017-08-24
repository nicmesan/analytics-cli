var oauth = require('../integrations/oauth');
var winston = require('winston');


var setCredentials = function (req, res, next) {
    var refreshToken = req.context.clientData.tokens.googleApiRefreshToken;

    oauth.setExistingCredentials(refreshToken)
        .then(function () {
            winston.info('Client credentials were set');
            next()
        }).catch((err) => {
        next(err);
    })
};

module.exports = setCredentials;