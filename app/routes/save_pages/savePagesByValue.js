var Pages = require('../../collections/pages');
var analytics = require('../../services/analytics');
var auth = require('../../services/oauth');
var Promise = require('bluebird');

exports.saveTopValuePages = function (req, res) {
    var clientId = req.params.clientId;
    getPages (res, req)
        .then(function (data) {
            var dataToSave = data.reports[0].data.rows;
            if (!dataToSave) {
                res.status(400).send({ message: 'Client has 0 pages'});
            }
            else {
                dataToSave = dataToSave.map(function(row) {
                    return formatPageRow(row, clientId);
                });
                var pagesToSave = Pages.collections.forge(dataToSave);
                return pagesToSave.invokeThen('save', null)
                    .then(function () {
                        res.status(200).send({ message: dataToSave.length + ' pages successfully saved'});
                    }, function (error) {
                        res.status(400).send({ message: 'Data could not be saved in the DB', error : error });
                    });
            }
        }, function (error) {
            res.status(400).json({message: "Could't fetch data from Analytics", error: error})
        })
        .catch(function (error) {
            res.status(500).json({message: "Internal server error ", error: error})
        })
};

function getPages (res, req) {
    var pageSize = req.body.pageSize;
    var clientId = req.params.clientId;
    var orderBy = req.body.orderBy;

    var options = {
        pageSize: pageSize,
        metrics: [
            {"expression": "ga:pageValue"},
            {"expression": "ga:sessions"}
            ],
        dimensions: [
            { name: 'ga:pagePath' },
            { name: "ga:segment" }
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

    if (!pageSize || !clientId) { res.status(400).json({ message: 'Include page size and client ID'})}

    else {

        return Promise.resolve(auth.setExistingCredentials(clientId)
            .then(function () {
                return analytics.getViewIdByClientId(clientId)
                    .then(function (viewId) {
                        return analytics.fetch(viewId, options)
                    }, function (error) {
                        res.status(400).json({message: "Client ID not found", error: error})
                    })
            }, function (error) {
                res.status(400).json({message: "Credentials could'nt be set", error: error})
            })
        )
    }
}




function formatPageRow (row, clientId) {
    return {
        pageValue: row.metrics[0].values[0],
        pagePath: row.dimensions[0],
        sessions: row.metrics[0].values[1],
        clientId: clientId
    }
}