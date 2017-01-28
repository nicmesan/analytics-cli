var Promise = require('bluebird');
var saveKeywordsByPage = require('../save_keywords/saveKeywordsByPage').saveKeywordsByPage;
var getKeywords = require('../save_keywords/saveKeywordsByPage').getKeywords;
var Pages = require('../../collections/pages');

exports.saveAllKeywords = function (req, res, next) {
    var clientId = req.params.clientId;
    Pages.collections.forge({clientId: clientId})
        .fetch()
        .then(function (pages) {
            console.log('finished', pages.toJSON());
            // pages = [pages.toJSON()[0], pages.toJSON()[1]];
            Promise.map(pages.toJSON(), function (page) {
                return getKeywords(page.id, clientId, next)
            })
            .then(function () {
                return res.status(400).send({message: 'All keywords were saved'});
            })

            // Promise.all(savePages[0])
            //     .then(function () {
            //         return res.status(400).send({message: 'All keywords were saved'});
            //     })
        })
};