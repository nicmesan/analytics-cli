var knex = require("../../config/knex.js");

function getTopKsets (amount, clientId) {
    return knex.select('keywords.id','keywords.keyword','keywords.keywordValue')
        .from('keywords').leftJoin('pages', 'pages.id', 'keywords.pageId')
        .where('pages.clientId','=', clientId)
        .orderBy('keywordValue', 'desc').limit(amount);
}

function insertFilteredKsets (businessFilteredKsets, clientId) {

    var filteredKsets = [];
    businessFilteredKsets.forEach(function (row) {
        return filteredKsets.push({
            originalKeywordId: row.id,
            keyword: row.keyword,
            clientId: clientId,
        });
    });

    return knex.transaction(function(trx) {
        knex.insert(filteredKsets)
            .into('business_filtered_keywords')
            .transacting(trx)
            .then(trx.commit)
            .catch(trx.rollback);
    });
}

exports.saveKsetsToDb = function (amount, clientId) {
    return getTopKsets(amount, clientId)
        .then(function (topKsets) {
            if (topKsets.length < 1) {
                return null;
            }

            return insertFilteredKsets(topKsets, clientId);
        })
};