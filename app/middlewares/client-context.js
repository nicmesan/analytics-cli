let searchEs = require('../utils/search-es');
let winston = require('winston');
let validator = require('../utils/required-parameter-validator');

function getClientData(req, res, next) {

    validator.validateRequiredParameters({
        clientKey: clientKey,
    });

    let clientKey = req.params.clientKey;

    let body = {
        query: {
            match: {
                clientKey: clientKey
            }
        },
    };
    
    return searchEs(clientKey, 'clients', body)
        .then((clientData) => {
        if (clientData.length == 0) {
            throw new Error("No client was found with that key. Check your client key");
        };

        if (clientData.length > 1) {
            throw new Error("Multiple clients were found with that key. Check the client database: this should never happen.");
        }

        req.context.clientData = clientData;
        next();

    });
}

var clientService = {
    getClientData: getClientData
}

module.exports = clientService;
