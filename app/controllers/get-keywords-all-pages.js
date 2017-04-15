var Promise = require('bluebird');
var searchConsole = require('../lib/search-console');
var Pages = require('../collections/pages');
var winston = require('winston');

exports.saveAllKeywords = function (req, res, next) {
    var clientId = req.params.clientId;

    Pages.collections.forge({clientId: clientId})
        .fetch()
        .then(function (pages) {

            if (pages.length < 1) {
                res.status(200).json({message: "No pages associated with this client ID"})
            }

            else {
                var promisesList = [];
                for(var i = 0; i < pages.length; i += 5) {

                    var pagesBatch = pages.toJSON().slice(i ,i + 5);

                    pagesBatch.forEach(function(page) {
                        promisesList.push(
                            Promise.delay(i * 1000).then(function() {
                                return searchConsole.saveKeywordsByPage(page.id, clientId)
                            })
                        );
                    });
                }

               return Promise.all(promisesList).then(function() {
                   winston.info("Keywords correctly saved");
                   res.status(200).json({message: "Keywords correctly saved"})
                });
            }
        })
        .catch(function (err) {
            next(err)
        })
};