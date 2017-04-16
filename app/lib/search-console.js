var errors = require('../errors');
var searchConsole = require('../integrations/search-console');
var knex = require('../../config/knex');
var Promise = require("bluebird");
var winston = require('winston');

exports.saveKeySetsByPage = function (pageId, clientId) {

    if (!pageId || !clientId) {
        throw errors.httpError('Include page size and client ID')
    }

    else {
        return Promise.join(searchConsole.getPagePathByPageId(pageId), searchConsole.getDomainByClientId(clientId), function (pagePath, domain) {
            var fullUrl = 'http://' + domain + pagePath;
            var options = {
                startRow: 1,
                dimensions: ['query'],
                filters: [searchConsole.getFilter('page', 'equals', fullUrl)]
            };
            return searchConsole.fetch(domain, options)
        })
        .then(function (data) {
            var dataToSave = data.rows;
            if (dataToSave) {
                winston.debug(data.rows.length + ' keywords fetched from page id ' + pageId);
                dataToSave.forEach(function (row) {
                    row.keys = row.keys[0].replace(/[^\x20-\x7E]+/g, '');
                    row.pageId = pageId;
                });
                return saveRows(dataToSave);
            } else {
                return null;
            }

        })
        .catch(function (err) {
            throw errors.httpError('Save ksets error', err)
        })
    }
};

function saveRows(rows) {
    return knex.transaction(function (trx) {
        knex.insert(rows)
            .into('ksets')
            .transacting(trx)
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch(function (err) {
        throw errors.httpError('Data could not be saved in the DB', err)
    });
}