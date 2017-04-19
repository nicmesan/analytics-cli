var knex = require("../../config/knex.js");

function getTopKsets (amount, clientId) {
    return knex.select('ksets.id','ksets.keys','ksets.keySetValue')
        .from('ksets').leftJoin('pages', 'pages.id', 'ksets.pageId')
        .where('pages.clientId','=', clientId)
        .orderBy('keySetValue', 'desc').limit(amount);
}

function insertFilteredKsets (businessFilteredKsets, clientId) {

    var filteredKsets = [];
    businessFilteredKsets.forEach(function (row) {
        return filteredKsets.push({
            keySetId: row.id,
            keys: row.keys,
            clientId: clientId,
        });
    });

    return knex.transaction(function(trx) {
        knex.insert(filteredKsets)
            .into('business_filtered_ksets')
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