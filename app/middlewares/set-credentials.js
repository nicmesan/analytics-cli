var oauth = require('../integrations/google-apis/oauth');
var winston = require('winston');


var setCredentials = function (req, res, next) {
    var refreshToken = req.context.clientData.tokens.googleApiRefreshToken;

    oauth.setExistingCredentials(refreshToken)
        .then(function () {
            winston.info('Client credentials were set',{
                clientKey: req.context.clientData.clientKey,
                origin: "anaytics-cli.middlewares.set-credentials"
            });
            next()
        }).catch((err) => {
        next(err);
    })
};

module.exports = setCredentials;