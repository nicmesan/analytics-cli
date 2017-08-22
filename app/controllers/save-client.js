let validator = require('../utils/required-parameter-validator');
let clients = require('../mocks/clients.json');
let _ = require('lodash');
let esInsert = require('../utils/upsert');
let winston = require('winston');

module.exports = function (req, res, next) {
    let clientKey = req.params.clientKey;
    validator.validateRequiredParameters({clientKey: clientKey});
    var searchedClient = _.find(clients.clients, clientKey)[clientKey];
    return esInsert(searchedClient, 'clients')
        .then((result) => {
            winston.info('Client was successfully saved', searchedClient);
            res.status(200).json({message: "Client was inserted successfully", client: searchedClient});
        })
        .catch((err) => {
            winston.error('Error saving client', searchedClient, err);
            next(err);
        })

};
