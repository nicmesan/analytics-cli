const errors = require('../errors');
const searchConsole = require('../integrations/search-console');
const knex = require('../../config/knex');
const Promise = require("bluebird");
const winston = require('winston');
const keywordValue = require('./keyword-value');
const insertOrReplace = require('../utils/upsert');

exports.saveKeywordsByPage = function (pageData, clientData) {

    let fullUrl = 'https://' + pageData.pagePath;
    let options = {
        startRow: 1,
        dimensions: ['query'],
        filters: [searchConsole.getFilter('page', 'equals', fullUrl)]
    };

    return searchConsole.fetch(clientData.siteName, options)
        .then(function (data) {
            let dataToSave = data.rows;
            if (dataToSave) {
                winston.info(data.rows.length + ' keywords fetched from page \'' + pageData.pagePath + '\'');

                let formattedKeywords = dataToSave.map((row) => {
                    return formatRow(row, clientData.id, pageData.pagePath)
                });

                return insertOrReplace(formattedKeywords, 'keywords');
            } else {
                winston.info('No keywords! (0) keywords fetched from page \'' + pageData.pagePath + '\'');
                return null;
            }

        })
        .catch(function (err) {
            winston.info('Error saving page keywords', err);
            throw new errors.keywordSaveError('Save keywords error', err)
        })
};

function formatRow(row, clientId, pagePath) {

    return {
        keyword: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
        page: pagePath,
        keywordValue: keywordValue.getKeySetValue(row.position, row.impressions),
        clientId: clientId
    }
}
