var knex = require("../../config/knex.js");
var winston = require('winston');
var Promise = require('bluebird');

//Private

function getKsets(clientId) {
    return knex.from('ksets').innerJoin('pages', 'ksets.pageId', 'pages.id').where('clientId','=', clientId);
};

function insertKeyword(keyword, ksetId) {
    return knex('keywords').insert({
        keyword: keyword,
        ksetId: ksetId
    })
};


//Public
module.exports = {
    splitKsets: function splitKsets(clientId) {
        winston.info("Splitting keywords for client " + clientId);
        var insertPromises = [];
        getKsets(clientId).then(function(ksets) {
            ksets.forEach(function(kset) {
                kset.keys.split(' ').forEach(function(keyword) {
                    insertPromises.push(insertKeyword(keyword, kset.id));
                })
            });
            return Promise.all(insertPromises).then(function(values) {
                return values
            })
        })

    }
};