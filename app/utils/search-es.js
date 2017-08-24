let client = require('../../config/elasticsearch');
let winston = require('winston');

module.exports = function (clientId, type, body) {
    return new Promise((resolve, reject) => {
        client.search({
            index: 'tarantula',
            type: type,
            body: body
        }, function (error, response) {
            if (error) {
                winston.error("Elasticsearch error: " + error);
                reject(error);
            }
            else {
                winston.info("Found records in ES for type " + type + ". Got " + response.hits.hits.length + " hits.");
                resolve(response.hits.hits.map((hit) => {
                    return hit['_source'];
                }));
            }
        });
    });
};