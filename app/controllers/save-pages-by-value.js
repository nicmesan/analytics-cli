const errors = require('../errors');
const analytics = require('../lib/analytics');
const winston = require('winston');
const knex = require("../../config/knex.js");
const util = require('util');
const insertOrReplace = require('../utils/upsert');

exports.saveTopValuePages = function (req, res, next) {
    let clientId = req.params.clientId;
    let pageSize = req.body.pageSize;
    let orderBy = req.body.orderBy;

    return analytics.getPages(pageSize, clientId, orderBy)
        .then(function (data) {
            let dataToSave = data.reports[0].data.rows;
            if (!dataToSave) {
                throw errors.httpError('No pages to save');
            }

            dataToSave = dataToSave.map(function (row) {
                return formatPageRow(row, clientId);
            });
            return insertOrReplace(dataToSave, 'pages', 'pagePath')
                .catch(function (error) {
                    throw errors.httpError('Data could not be saved in the DB', error);
                });
        })
        .then(function (dataSaved) {
            winston.info(`${dataSaved[0].affectedRows} were successfully saved/updated in DB`)
            res.status(200).send({message: dataSaved[0].affectedRows + ' were successfully saved/updated in DB'});
        })
        .catch(function (err) {
            next(err);
        })
};

function formatPageRow(row, clientId) {
    return {
        pageValue: row.metrics[0].values[0],
        pagePath: row.dimensions[0],
        sessions: row.metrics[0].values[1],
        clientId: clientId
    }
}
