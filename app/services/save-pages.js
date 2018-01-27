const errors = require('../errors');
const analytics = require('../integrations/google-apis/analytics');
const winston = require('winston');
const util = require('util');
const elasticsearch = require('../integrations/elasticsearch');
let validator = require('../utils/required-parameter-validator');

function formatPageRow(row, clientKey, runId) {
    return {
        pageValue: row.metrics[0].values[0],
        pagePath: row.dimensions[0],
        sessions: row.metrics[0].values[1],
        clientKey: clientKey,
        runId: runId
    }
}

module.exports = function (pageSize, orderBy, clientData, runId) {

    let viewId = clientData.viewId;
    let clientKey = clientData.clientKey;

    return analytics.getPages(pageSize, viewId, orderBy)
        .then(function (data) {

            let dataToSave = data.reports[0].data.rows;
            if (!dataToSave) {
                throw errors.httpError('No pages to save');
            }

            dataToSave = dataToSave.map(function (row) {
                return formatPageRow(row, clientKey, runId);
            });

            return elasticsearch.insert(clientKey, 'pages', dataToSave)
                .catch(function (error) {
                    winston.error(error, {
                        amount: pageSize,
                        origin: 'analytics-cli.services.save-pages',
                        siteName: clientData.siteName,
                        client: clientData.clientKey,
                        runId: runId,
                        error: error
                    });
                    throw errors.httpError('Data could not be saved in the DB', error);
                });
        })
        .then(function () {
            var message = pageSize + ' pages were successfully saved/updated in DB';
            winston.info(message, {
                amount: pageSize,
                origin: 'analytics-cli.services.save-pages',
                siteName: clientData.siteName,
                client: clientData.clientKey,
                runId: runId
            });
        })
};
