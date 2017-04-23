var knex = require("../../config/knex.js");
var winston = require('winston');
var Promise = require('bluebird');
var _ = require('lodash');
var proxyConsumption = require('./proxy-consumption');

//Private

function getKsets (clientId) {
    return knex.select('kset', 'keySetId').from('product_filtered_ksets').where('clientId','=', clientId);
}

function getNegativeKeywords (clientId) {
    return knex.select('keyword').from('negative_keywords').where('clientId','=', clientId);
}

function filterNegativeKeywords(ksets, negativeKeywords) {
    return _.filter(ksets, function(kset){
        return !isNegativeKset(kset, negativeKeywords);
    });
}

function isNegativeKset(kset, negativeKeywords) {
    return (_.intersection(kset.keys.split(' '), negativeKeywords).length > 0);
}

exports.filterNegativeKsets = function (clientId) {
    let negativeKeywordsPromise = getNegativeKeywords(clientId);
    let ksetsPromise = getKsets(clientId);

    return Promise.join(negativeKeywordsPromise, ksetsPromise, (negativeKeywords, ksets) => {

        var negativeKeywordsVector = _.map(negativeKeywords,function(negativeKeyword) {
            return negativeKeyword.keyword;
        });

        let filteredKsets = filterNegativeKeywords(ksets, negativeKeywordsVector);
        return proxyConsumption.prepareForProxyConsumption(filteredKsets, clientId).then(function(targetKsets) {
            return knex.transaction(function(trx) {
                knex.insert(targetKsets)
                    .into('target_ksets')
                    .transacting(trx)
                    .then(trx.commit)
                    .catch(trx.rollback);
            });
        });
    });
};
