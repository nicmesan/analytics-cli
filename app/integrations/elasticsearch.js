/**
 * Created by javieranselmi on 8/24/17.
 */
let CONSTANTS = require("../constants");
let client = require('../../config/elasticsearch');
let winston = require('winston');
let Promise = require("bluebird");
let _ = require('lodash');

module.exports.query = function query(clientKey, type, body, opts) {
    opts = opts || {};
    let maxSize = CONSTANTS.maxElasticSingleQuerySize;
    body.size = body.size || maxSize;

    if (body.size > maxSize) {
        var message = "Trying to query elasticsearch with a single query that was too large. (Max:" + maxSize + ", AttemptedSize:" + opts.size + "). Use batchQuery instead";
        winston.error(message);
        return Promise.reject(new Error(message));
    }

    return new Promise((resolve, reject) => {
        client.search({
            index: opts.customIndex ? opts.customIndex : clientKey,
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

module.exports.insert = function(clientKey, type, data, opts) {
    opts = opts || {};
    data = _.isArray(data) ? data : [data];

    var bulkActions = [];
    var bulkActionObject = {
        index: {
        _index: opts.customIndex ? opts.customIndex : clientKey,
        _type: type
        }
    };

    _.each(data, (document) => {
        bulkActions.push(bulkActionObject);
        bulkActions.push(document);
    });

    return new Promise((resolve, reject) => {
        client.bulk({
            body: bulkActions
        }, function (err, resp) {
            if (err) {
                winston.error('Error inserting documents into type \''+ type +'\' in elasticsearch', err);
                reject(err);
            };
            winston.info('Inserted ' + data.length + ' documents into type \''+ type +'\' in elasticsearch');
            resolve(data.length);
        });
    });
};
