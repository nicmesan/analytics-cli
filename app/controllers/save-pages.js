const errors = require('../errors');
const analytics = require('../integrations/google-apis/analytics');
const winston = require('winston');
const util = require('util');
const elasticsearch = require('../integrations/elasticsearch');
let validator = require('../utils/required-parameter-validator');

function formatPageRow(row, clientKey) {
    return {
        pageValue: row.metrics[0].values[0],
        pagePath: row.dimensions[0],
        sessions: row.metrics[0].values[1],
        clientKey: clientKey
    }
}

module.exports = function (req, res, next) {

    let pageSize = req.body.pageSize;
    let orderBy = req.body.orderBy;
    let viewId = req.context.clientData.viewId;
    let clientKey = req.context.clientData.clientKey;

    validator.validateRequiredParameters({
        pageSize: pageSize,
    });

    return analytics.getPages(pageSize, viewId, orderBy)
        .then(function (data) {

            let dataToSave = data.reports[0].data.rows;
            if (!dataToSave) {
                throw errors.httpError('No pages to save');
            }

            dataToSave = dataToSave.map(function (row) {
                return formatPageRow(row, clientKey);
            });

            return elasticsearch.insert(clientKey, 'pages', dataToSave)
                .catch(function (error) {
                    throw errors.httpError('Data could not be saved in the DB', error);
                });
        })
        .then(function () {

            var message = pageSize + ' pages were successfully saved/updated in DB';
            winston.info(message);
            res.status(200).send({message: message});
        })
        .catch(function (err) {
            next(err);
        })
};
