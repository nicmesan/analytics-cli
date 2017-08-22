let client = require("../../config/elasticsearch");
let Promise = require("bluebird");
let winston = require("winston");
let _ = require('lodash');

module.exports = function insertOrReplace(data, type) {

    data = _.isObject(data) ? [data] : data;

    var bulkActions = [];
    var bulkActionObject = {index: {_index: 'tarantula', _type: type}};

    _.each(data, (document) => {
        bulkActions.push(bulkActionObject);
        bulkActions.push(document);
    });

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
