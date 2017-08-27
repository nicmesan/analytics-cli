let validator = require('../utils/required-parameter-validator');
let clients = require('../mocks/clients.json');
let _ = require('lodash');
let elasticsearch = require('../integrations/elasticsearch');
let winston = require('winston');

module.exports = function (req, res, next) {
    let clientKey = req.params.clientKey;
    validator.validateRequiredParameters({clientKey: clientKey});
    var searchedClient = _.find(clients.clients, clientKey)[clientKey];

    return elasticsearch.insert(clientKey, 'clients', searchedClient)
        .then(() => {
            winston.info('Client was successfully saved', searchedClient);
            res.status(200).json({message: "Client was inserted successfully", client: searchedClient});
        })
        .catch((err) => {
            winston.error('Error saving client', searchedClient, err);
            next(err);
        })

};
