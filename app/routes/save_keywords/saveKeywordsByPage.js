var Ksets = require('../../collections/kset');
var searchConsole = require('../../services/search-console');
var auth = require('../../services/oauth');

exports.saveKeywordsByPage = function (req, res) {
    var pageId = req.body.pageId;
    var clientId = req.params.clientId;

    if (!pageId || !clientId) {
        res.status(400).json({message: 'Include page size and client ID'})
    }

    else {
        searchConsole.getPagePathByPageId(pageId)
            .then(function (pagePath) {
                return searchConsole.getDomainByClientId(clientId)
                    .then(function (domain) {
                        return auth.setExistingCredentials(clientId)
                            .then(function () {
                                var fullUrl = 'http://' + domain + pagePath;
                                var options = {
                                    startRow: 1,
                                    dimensions: ['query'],
                                    filters: [ searchConsole.getFilter('page', 'equals', fullUrl) ]
                                };
                                return searchConsole.fetch(domain, options)
                                    .then( function (data) {
                                        var dataToSave = data.rows;
                                        if (!dataToSave) {
                                            res.status(400).send({message: 'Client has 0 keywords for that page'});
                                        }
                                        else {
                                            dataToSave.forEach(function(row) {
                                                row.keys = row.keys[0];
                                                row.pageId = pageId;
                                            });
                                            var keywordsToSave = Ksets.collections.forge(dataToSave);
                                            keywordsToSave.invokeThen('save', null)
                                                .then(function() {
                                                    res.status(200).send({ message: dataToSave.length + ' keywords successfully saved'});
                                                }, function (error) {
                                                    res.status(400).send({ message: 'Data could not be saved in the DB', error : error });
                                                });
                                        }

                                    })
                            }, function (error) {
                                res.status(400).json({message: "Credentials could'nt be set", error: error})
                            })
                    }, function (error) {
                        res.status(400).send({ message: 'Cannot find client domain in DB', error : error });
                    })
            }, function (error) {
                res.status(400).send({ message: 'Cannot find page path in DB', error : error });
            })
            .catch(function (error) {
                res.status(500).json({message: "Internal server error ", error: error})
            })
    }
};