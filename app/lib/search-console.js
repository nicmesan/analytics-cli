const errors = require('../errors');
const searchConsole = require('../integrations/search-console');
const knex = require('../../config/knex');
const Promise = require("bluebird");
const winston = require('winston');
const keywordValue = require('./keyword-value');
const insertOrReplace = require('../utils/upsert');

exports.saveKeywordsByPage = function (pageId, clientId) {

    if (!pageId || !clientId) {
        throw errors.httpError('Include page size and client ID')
    }

    else {
        return Promise.join(searchConsole.getPagePathByPageId(pageId), searchConsole.getDomainByClientId(clientId), function (pagePath, domain) {
            let fullUrl = 'http://' + domain + pagePath;
            let options = {
                startRow: 1,
                dimensions: ['query'],
                filters: [searchConsole.getFilter('page', 'equals', fullUrl)]
            };
            return searchConsole.fetch(domain, options)
        })
        .then(function (data) {
            let dataToSave = data.rows;
            if (dataToSave) {
                winston.debug(data.rows.length + ' keywords fetched from page id ' + pageId);

                let formattedKeywords = dataToSave.map((row) => {
                    return formatRow(row, clientId, pageId)
                });

                return insertOrReplace(formattedKeywords, 'keywords', 'keyword');
            } else {
                return null;
            }

        })
        .catch(function (err) {
            winston.info('Error saving page keywords', err);
            throw new errors.keywordSaveError('Save keywords error', err)
        })
    }
};

function formatRow (row, clientId, pageId) {

    return {
        keyword: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
        pageId:pageId,
        keywordValue: keywordValue.getKeySetValue(row.position, row.impressions),
        clientId: clientId
    }
}

function saveRows(rows) {
    return knex.transaction(function (trx) {
        knex.insert(rows)
            .into('keywords')
            .transacting(trx)
            .then(trx.commit)
            .catch(trx.rollback);
    });
}
