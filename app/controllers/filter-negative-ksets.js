var filterNegativeKsets = require('../services/filter-negative-ksets');
var winston = require('winston');

exports.filterNegativeKsets = function (req, res, next) {
    var clientId = req.params.clientId;

    filterNegativeKsets.filterNegativeKsets(clientId)
        .then(function (keySetSaved) {
            if (keySetSaved) {
                winston.info('Target ksets have been generated correctly');
                res.status(200).json({message: 'Target ksets have been generated correctly'})
            }
        })
        .catch(function (err) {
            next(err)
        })
};