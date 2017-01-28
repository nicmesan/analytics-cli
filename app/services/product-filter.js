var knex = require("../../config/knex.js");
var winston = require('winston');

//Private
function filterProducts(clientId) {
    return knex.raw('INSERT INTO target_ksets (`keys`,clientId)' +
        ' (SELECT REPLACE(`keys`, \' \', \'-\'),' + clientId + ' ' +
        'FROM ksets WHERE `keys` IN ' +
        '(SELECT description FROM products))');
};

function getKsets(clientId) {
    return knex.from('ksets').innerJoin('pages', 'ksets.pageId', 'pages.id').where('clientId','=', clientId);
};

function insertKeyword(keyword, ksetId) {
    return knex('keywords').insert({
        keyword: keyword,
        ksetId: ksetId
    })
}

function splitKsets(clientId) {
    winston.info("Splitting keywords for client " + clientId);
    var insertPromises = [];
    getKsets(clientId).then(function(ksets) {
        ksets.forEach(function(kset) {
            kset.keys.split(' ').forEach(function(keyword) {
                insertPromises.push(insertKeyword(keyword, kset.id));
            })
        })
    })
    return Promise.all(insertPromises).then(function(values) {
        return values
    }, function(error) {
        next({ message: 'There was an error inserting splitted keywords', error : error });
    });
}

//Public
module.exports = {
    filterProducts: filterProducts,
    splitKsets: splitKsets
};
