let client = require('../../config/elasticsearch');

module.exports = function (clientId, type, body) {
    return new Promise((resolve, reject) => {
        client.search({
            index: 'tarantula',
            type: type,
            body: {
                query: {
                    match_all: {}
                },
                from : 0,
                size : 100,
            }
        }, function (error, response) {
            if (error) {
                console.log("Elasticsearch error: " + error);
                reject(err);
            }
            else {
                console.log("Found records in ES for type " + type + ". Got " + response.hits.hits.length + " hits.");
                resolve(response.hits.hits.map((hit) => {
                    return hit['_source'];
                }));
            }
        });
    });
};