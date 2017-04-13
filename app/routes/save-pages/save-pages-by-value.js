var Pages = require('../../collections/pages');
var analytics = require('../../services/analytics');
var auth = require('../../services/oauth');
var Promise = require('bluebird');

exports.saveTopValuePages = function (req, res, next) {
    var clientId = req.params.clientId;


    return getPages(req.body.pageSize, req.params.clientId, req.body.orderBy)
        .then(function (data) {
            var dataToSave = data.reports[0].data.rows;
            if (!dataToSave) {
                throw Error('No pages to save');
            }

            dataToSave = dataToSave.map(function (row) {
                return formatPageRow(row, clientId);
            });

            return Pages.collections.forge(dataToSave);

        })
        .then(function(pagesToSave) {

            return pagesToSave.invokeThen('save', null)
                .catch(function (error) {
                    var err = new Error('Data could not be saved in the DB')
                    err.originalError = error;
                    throw err
                });
        })
        .then(function (dataToSave) {
            res.status(200).send({message: dataToSave.length + ' pages successfully saved'});
        })
        .catch(function (err) {
            console.log('save pages cached error', err)
            next(err);
        })
};

function getPages(pageSize, clientId, orderBy) {

    if (!pageSize || !clientId) {
        throw Error('Include page size and client ID');
    }

    var options = getAnalyticsOptions(pageSize, orderBy);

    return analytics.getViewIdByClientId(clientId)
        .then(function (viewId) {
            return analytics.fetch(viewId, options)
        })
        .catch(function (error) {
            throw Error("Client ID not found");
        });
}

function formatPageRow(row, clientId) {
    return {
        pageValue: row.metrics[0].values[0],
        pagePath: row.dimensions[0],
        sessions: row.metrics[0].values[1],
        clientId: clientId
    }
}

function getAnalyticsOptions(pageSize, orderBy) {
    return {
        pageSize: pageSize,
        metrics: [
            {"expression": "ga:pageValue"},
            {"expression": "ga:sessions"}
        ],
        dimensions: [
            {name: 'ga:pagePath'},
            {name: "ga:segment"}
        ],
        orderBys: [
            {
                "sortOrder": "DESCENDING",
                "fieldName": orderBy || "ga:pageValue"
            }
        ],
        segments: [
            {
                "segmentId": "gaid::TRNU4qP8Q6K5L8nPDicJaA"
            }
        ]
    };
}