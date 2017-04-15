var Ksets = require('../collections/kset');
var winston = require('winston');
var searchConsole = require('../lib/search-console');


exports.saveKeywords = function (req, res, next) {
    var pageId = req.body.pageId;
    var clientId = req.params.clientId;

    searchConsole.saveKeywordsByPage(pageId, clientId, next)
        .then(function (keywordSaved) {
            if (keywordSaved) {
                res.status(200).json({message: 'All keywords for page ID ' + pageId + ' have been saved successfully'})
            }

            else {
                res.status(200).json({message: 'Page ID ' + pageId + ' has no related ksets'})
            }
        })
        .catch(function (err) {
            next(err)
        })
};