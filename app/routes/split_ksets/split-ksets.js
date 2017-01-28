var productFilter = require('../../services/product-filter');

exports.splitKsets = function (req, res) {
    var clientId = req.params.clientId;

    if (!clientId) {
        res.status(400).json({message: 'Include client ID'})
    } else {
        productFilter.splitKsets(clientId)
            .then(function(success) {
                res.send({ message: 'Ksets correctly splitted'})
            }, function (error) {
                res.status(400).send({ message: 'Database error splitting ksets', error : error });
            })
            .catch(function (error) {
                res.status(500).json({message: "Internal server error ", error: error})
            })
    };
};