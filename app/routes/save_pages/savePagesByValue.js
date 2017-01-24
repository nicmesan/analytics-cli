var Pages = require('../../collections/pages');
var analytics = require('../../services/analytics');
var auth = require('../../services/oauth');

exports.saveTopValuePages = function (req, res) {
    var pageSize = req.body.pageSize;
    var clientId = req.params.clientId;

    var options = {
        pageSize: pageSize,
        metrics: [{"expression":"ga:pageValue"}],
        dimensions: [
            { name: 'ga:pagePath' },
            { name: "ga:segment" }
        ],
        orderBys: [
            {
                "sortOrder": "DESCENDING",
                "fieldName": "ga:pageValue"
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
        auth.setExistingCredentials(clientId)
            .then(function (data) {
                return analytics.getViewIdByClientId(clientId)
                    .then(function (viewId) {
                        return analytics.fetch(viewId, options)
                            .then(function (data) {
                                var dataToSave = data.reports[0].data.rows;
                                if (!dataToSave) {
                                    res.status(400).send({ message: 'Client has 0 pages'});
                                }
                                else {
                                    dataToSave = dataToSave.map(function(row) {
                                        return formatPageRow(row);
                                    });
                                    var pagesToSave = Pages.collections.forge(dataToSave);
                                    pagesToSave.invokeThen('save', null)
                                        .then(function () {
                                            res.status(200).send({ message: dataToSave.length + ' pages successfully saved'});
                                        }, function (error) {
                                            res.status(400).send({ message: 'Data could not be saved in the DB', error : error });
                                        });
                                }
                            }, function (error) {
                                res.status(400).json({message: "Could't fetch data from Analytics", error: error})
                            })
                    }, function (error) {
                        res.status(400).json({message: "Client ID not found", error: error})
                    })
            }, function (error) {
                res.status(400).json({message: "Credentials could'nt be set", error: error})
            })
            .catch(function (error) {
                res.status(500).json({message: "Internal server error ", error: error})
            })
    }
};

function formatPageRow (row) {
    return {
        pageValue: row.metrics[0].values[0],
        pagePath: row.dimensions[0]
    }
}