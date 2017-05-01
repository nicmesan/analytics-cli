let knex = require("../../config/knex.js");
let winston = require('winston');
let Promise = require('bluebird');
let _ = require('lodash');
let proxyConsumption = require('./proxy-consumption');

//Private

function getKsets(clientId) {
    return knex.select('keyword', 'originalKeywordId').from('product_filtered_keywords').where('clientId', '=', clientId);
}

function getNegativeKeywords(clientId) {
    return knex.select('keyword').from('negative_keywords').where('clientId', '=', clientId);
}

function filterNegativeKeywords(ksets, negativeKeywords) {
    return _.filter(ksets, function (kset) {
        return !isNegativeKset(kset, negativeKeywords);
    });
}

function isNegativeKset(keyword, negativeKeywords) {
    return (_.intersection(keyword.keyword.split(' '), negativeKeywords).length > 0);
}

exports.filterNegativeKsets = function (clientId) {
    let negativeKeywordsPromise = getNegativeKeywords(clientId);
    let ksetsPromise = getKsets(clientId);

    return Promise.join(negativeKeywordsPromise, ksetsPromise, (negativeKeywords, ksets) => {

        let negativeKeywordsVector = _.map(negativeKeywords, function (negativeKeyword) {
            return negativeKeyword.keyword;
        });

        let filteredKsets = filterNegativeKeywords(ksets, negativeKeywordsVector);
        return proxyConsumption.prepareForProxyConsumption(filteredKsets, clientId)
            .then((targetKeywords) => {
                return knex.transaction(function (trx) {
                    knex.insert(targetKeywords)
                        .into('target_keywords')
                        .transacting(trx)
                        .then(trx.commit)
                        .catch(trx.rollback);
                });
            });
    });
};
