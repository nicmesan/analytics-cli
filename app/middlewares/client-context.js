let searchEs = require('../utils/search-es');
let winston = require('winston');
let validator = require('../utils/required-parameter-validator');
let _ = require('lodash');

// This middleware should retrieve the client data from the local "mocks" folder. If it does not find the
// client OR the mocks/clients.json file it should retrieve it from elasticSearch.

function getClientDataFromDatabase(clientKey) {

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
            }

            if (clientData.length > 1) {
                throw new Error("Multiple clients were found with that key. Check the client database: this should never happen.");
            }

            return clientData;
        });
}

function getClientData(req, res, next) {

    let clientKey = req.body.clientKey;

    validator.validateRequiredParameters({
        clientKey: clientKey,
    });

    let localClientsData;

    try {
        localClientsData = require('../mocks/clients.json');
        var clientData = _.find(localClientsData.clients,clientKey);
        if (!clientData) {
            throw new Error("Client data was not found locally");
        } else {
            winston.info("Client data was found locally and added to context");
            req.context = req.context || {};
            req.context.clientData = clientData[clientKey];
            next();
        }
    } catch(err) {
        return getClientDataFromDatabase(clientKey)
            .then((clientData) => {
                winston.info("Client data was found from database and added to context");
                req.context = req.context || {};
                req.context.clientData = clientData[0];
                next();

            }).catch((err) => {
                next(err);
            });
    }


}

module.exports = getClientData;

