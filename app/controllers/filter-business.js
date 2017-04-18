var businessFilter = require('../services/ksets-value');
var winston = require('winston');

exports.applyBusinessFilter = function (req, res, next) {
    var keySetsAmount = req.body.keySetsAmount;
    var clientId = req.params.clientId;

    if (!clientId || !keySetsAmount) {
        res.status(400).json({message: 'Include client ID and keysets amount'})
    }

    else {
        return businessFilter.saveKsetsToDb(keySetsAmount, clientId)
            .then(function(result) {
                if (!result) {
                    winston.info("There were no ksets available to save");
                    res.status(200).json({message: "There were no ksets available to save"})
                }
                else {
                    winston.info("Top ksets successfully filtered");
                    res.status(200).json({message: "Top ksets successfully filtered"})
                }
            })
            .catch(function (err) {
                next(err)
            })
    }
};