var winston = require('winston');
var filterSimilarKeywords = require('../services/keyword-similarity-filter');


exports.filterSimilarKeywords = function (req, res, next) {
    var clientId = req.params.clientId;

    filterSimilarKeywords(clientId)
        .then(function () {
                winston.info('Similar keywords have been grouped');
                res.status(200).json({message: 'Similar keywords have been grouped'})
        })
        .catch(function (err) {
            next(err)
        })
};