var knex = require("../../config/knex.js");
var winston = require('winston');
var Promise = require('bluebird');

//Private

function getWhiteKsets(clientId) {
    return knex.select('id','keys','ksetId').from('white_ksets');
};

function insertUnstoppedKsets(whiteKsets) {
    var formattedWhiteKsets = whiteKsets.map(function(kset) {
        return formatKset(kset);
    });
    return knex.transaction(function(trx) {
        knex.insert(formattedWhiteKsets)
            .into('unstopped_ksets')
            .transacting(trx)
            .then(trx.commit)
            .catch(trx.rollback);
    });
}

function isStopword(keyword) {
    return knex('stopwords').count('keyword').where('keyword','=',keyword).then(function(result) {
        var ocurrences = result[0]['count(`keyword`)'];
        return (ocurrences === 0);
    });
};

function formatKset(kset) {
    return {
        id: kset.id,
        keys: kset.keys,
        ksetId: kset.ksetId
    }
}

function filterStopwordsOnKset(kset) {
    return Promise.filter(kset.keys.split(' '), function(keyword) {
       return isStopword(keyword);
    }).then(function (filteredKeywordsArray) {
        return filteredKeywordsArray.join(' ');
    });
}

//Public
module.exports = {
    filterStopwords: function(clientId) {
        winston.info("Filtering ksets with negative keywords for client " + clientId);
        return getWhiteKsets(clientId).then(function(ksets) {
            return Promise.map(ksets , function(kset) {
                return filterStopwordsOnKset(kset);
            }).then(function(res) {
                return insertUnstoppedKsets(res);
            });
        });
    }
};
