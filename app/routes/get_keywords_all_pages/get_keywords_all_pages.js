var Promise = require('bluebird');
var saveKeywordsByPage = require('../save_keywords/saveKeywordsByPage').saveKeywordsByPage;
var getKeywords = require('../save_keywords/saveKeywordsByPage').getKeywords;
var Pages = require('../../collections/pages');

exports.saveAllKeywords = function (req, res, next) {
    var clientId = req.params.clientId;
    Pages.collections.forge({clientId: clientId})
        .fetch()
        .then(function (pages) {
            var promisesList = [];

            for(var i = 0; i < pages.length; i += 5) {

                var pagesBatch = pages.toJSON().slice(i ,i + 5);

                pagesBatch.forEach(function(page) {
                    promisesList.push(
                        Promise.delay(i * 1000).then(function() {
                            return getKeywords(page.id, clientId, next)
                        })
                    );
                });

            };

            Promise.all(promisesList).then(function() {
                    res.status(200).json({message: "Keywords correctly saved"})
            });
        })
};