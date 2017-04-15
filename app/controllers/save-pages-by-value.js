var Pages = require('../collections/pages');
var errors = require('../errors');
var analytics = require('../lib/analytics');

exports.saveTopValuePages = function (req, res, next) {
    var clientId = req.params.clientId;

    return analytics.getPages(req.body.pageSize, req.params.clientId, req.body.orderBy)
        .then(function (data) {
            var dataToSave = data.reports[0].data.rows;
            if (!dataToSave) {
                throw errors.httpError('No pages to save');
            }

            dataToSave = dataToSave.map(function (row) {
                return formatPageRow(row, clientId);
            });

            return Pages.collections.forge(dataToSave);

        })
        .then(function(pagesToSave) {

            return pagesToSave.invokeThen('save', null)
                .catch(function (error) {
                    throw errors.httpError('Data could not be saved in the DB', error);
                });
        })
        .then(function (dataToSave) {
            res.status(200).send({message: dataToSave.length + ' pages successfully saved'});
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
