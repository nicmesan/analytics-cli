var knex = require("../../config/knex.js");
var winston = require('winston');
var Promise = require('bluebird');

//Private

function getBusinessFilteredKsets(clientId) {
    return knex.select('id', 'keys', 'keySetId').from('business_filtered_ksets');
}

function insertUnstoppedKsets(whiteKsets) {
    var formattedWhiteKsets = whiteKsets.map(function (kset) {
        return formatKset(kset);
    });
    return knex.transaction(function (trx) {
        knex.insert(formattedWhiteKsets)
            .into('unstopped_ksets')
            .transacting(trx)
            .then(trx.commit)
            .catch(trx.rollback);
    });
}

function isStopword(keyword) {
    console.log('keyword', keyword)
    return knex('stopwords').count('keyword').where('keyword', '=', keyword).then(function (result) {
        var ocurrences = result[0]['count(`keyword`)'];
        return (ocurrences === 0);
    });
}

function formatKset(kset) {
    return {
        keys: kset.keys,
        ksetId: kset.ksetId
    }
}

function filterStopwords(keys) {
    return Promise.filter(keys.split('-'), function (keyword) {
        return isStopword(keyword);
    }).then(function (filteredKeywordsArray) {
        return filteredKeywordsArray.join('-');
    });
}


function filterStopwordsOnKset(kset) {
    return filterStopwords(kset.keys.replace(' ', '-'))
        .then(function (filteredKeys) {
            kset.keys = filteredKeys;
            return kset;
        });
}

//Public
module.exports = {
    filterStopwords: function (clientId) {
        winston.info("Filtering ksets with negative keywords for client " + clientId);

        return getBusinessFilteredKsets(clientId)
            .then(function (ksets) {
                console.log(ksets)
                return Promise.map(ksets, function (kset) {
                    return filterStopwordsOnKset(kset);
                })
                    .then(function (res) {
                        return insertUnstoppedKsets(res);
                    });
            });
    }
};
