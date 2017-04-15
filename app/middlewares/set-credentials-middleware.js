var oauth = require('../integrations/oauth');
var setCredentials =  function (req, res, next) {
    var clientId = req.params.clientId;

    oauth.setExistingCredentials(clientId)
        .then(function () {
            next()
        }, function (error) {
            next(error);
        })
};

module.exports = setCredentials;