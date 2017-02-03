var ksetFilters = require('../../services/stopwords-filter');

exports.filterStopwords = function (req, res, next) {
    var clientId = req.params.clientId;
    if (!clientId) {
        res.status(400).json({message: 'Include client ID'})
    } else {
        ksetFilters.filterStopwords(clientId)
            .then(function() {
                res.send({ message: 'Negative ksets correctly filtered'})
            })
            .catch(function(err) {
                next(err);
            });
    };
};