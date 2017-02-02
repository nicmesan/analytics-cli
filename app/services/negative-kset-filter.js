var knex = require("../../config/knex.js");
var winston = require('winston');
var Promise = require('bluebird');

//Private

function getFilteredKsets(clientId) {
    return knex.from('ksets').innerJoin('pages', 'ksets.pageId', 'pages.id').where('clientId','=', clientId);
};

function insertWhiteKsets(whiteKsets) {
    var formattedWhiteKsets = whiteKsets.map(function(kset) {
        return formatKset(kset);
    });
    return knex.transaction(function(trx) {
        knex.insert(formattedWhiteKsets)
            .into('white_ksets')
            .transacting(trx)
            .then(trx.commit)
            .catch(trx.rollback);
    });
}

function isPositiveKeyword(keyword) {
    return knex('negative_keywords').count('keyword').where('keyword','=',keyword).then(function(result) {
        var ocurrences = result[0]['count(`keyword`)'];
        return (ocurrences === 0);
    });
};

function formatKset(kset) {
    return {
        id: kset.id,
        keys: kset.keys,
        pageId: kset.pageId
    }
}

function isPositiveKset(kset) {
    var promises = kset.keys.split(' ').map(function(keyword) {
        return isPositiveKeyword(keyword);
    });

    return Promise.all(promises).then(function(values) {
        return values.some(function(value) {
            return value
        });
    });
}

function filterNegativeKsets(clientId) {
    winston.info("Filtering ksets with negative keywords for client " + clientId);

    return getFilteredKsets(clientId).then(function(ksets) {
        Promise.filter(ksets , function(kset) {
                return isPositiveKset(kset);
        }).then(function(res) {
            insertWhiteKsets(res);
        });
    });

};

//Public
module.exports = {
    filterNegativeKsets: function(clientId) {
        winston.info("Filtering ksets with negative keywords for client " + clientId);

        return getFilteredKsets(clientId).then(function(ksets) {
            Promise.filter(ksets , function(kset) {
                return isPositiveKset(kset);
            }).then(function(res) {
                insertWhiteKsets(res);
            });
        });
    }
};
