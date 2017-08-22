let client = require("../../config/elasticsearch");
let Promise = require("bluebird");
let winston = require("winston");

module.exports = function insertOrReplace(data, type) {

    var bulkActions = [];
    var bulkActionObject = {index: {_index: 'tarantula', _type: type}};

    data.forEach((document) => {
        bulkActions.push(bulkActionObject);
        bulkActions.push(document);
    })

    return new Promise((resolve, reject) => {
        client.bulk({
            body: bulkActions
        }, function (err, resp) {
            if (err) {
                reject(err);
            };
            winston.info('Inserted ' + data.length + ' documents into type \''+ type +'\' in elasticsearch');
            resolve(data.length);
        });
    });
};
