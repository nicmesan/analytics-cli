var productFilter = require('../../services/split-ksets');

exports.splitKsets = function (req, res, next) {
    var clientId = req.params.clientId;

    if (!clientId) {
        res.status(400).json({message: 'Include client ID'})
    } else {
        productFilter.splitKsets(clientId)
            .then(function(success) {
                res.send({ message: 'Ksets correctly splitted'})
            }, function (error) {
                next(error);
            })
            .catch(function (error) {
                res.status(500).json({message: "Internal server error ", error: error})
            })
    };
};