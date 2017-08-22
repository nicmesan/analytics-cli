const errors = require('../errors');
const analytics = require('../lib/analytics');
const winston = require('winston');
const knex = require("../../config/knex.js");
const util = require('util');
const insertOrReplace = require('../utils/upsert');
let validator = require('../utils/required-parameter-validator');

function formatPageRow(row, clientId) {
    return {
        pageValue: row.metrics[0].values[0],
        pagePath: row.dimensions[0],
        sessions: row.metrics[0].values[1],
        clientId: clientId
    }
}

module.exports = function (req, res, next) {
    let clientId = req.params.clientId;
    let pageSize = req.body.pageSize;
    let orderBy = req.body.orderBy;

    validator.validateRequiredParameters({
        clientId: clientId,
        pageSize: pageSize,
    });

    return analytics.getPages(pageSize, clientId, orderBy)
        .then(function (data) {
            let dataToSave = data.reports[0].data.rows;
            if (!dataToSave) {
                throw errors.httpError('No pages to save');
            }

            dataToSave = dataToSave.map(function (row) {
                return formatPageRow(row, clientId);
            });
            return insertOrReplace(dataToSave, 'pages')
                .catch(function (error) {
                    throw errors.httpError('Data could not be saved in the DB', error);
                });
        })
        .then(function (dataSaved) {

            var message = pageSize + ' pages were successfully saved/updated in DB';
            winston.info(message);
            res.status(200).send({message: message});
        })
        .catch(function (err) {
            next(err);
        })
};
