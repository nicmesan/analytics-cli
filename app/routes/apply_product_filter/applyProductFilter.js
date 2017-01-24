var productFilter = require('../../services/product-filter')

exports.applyProductFilter = function (req, res) {
    var clientId = req.params.clientId;

    if (!clientId) {
        res.status(400).json({message: 'Include client ID'})
    } else {
        productFilter.filterProducts(clientId)
            .then(function(success) {
                res.send({ message: 'Target ksets correctly generated'})
            }, function (error) {
                res.status(400).send({ message: 'Database error filtering ksets', error : error });
            })
            .catch(function (error) {
                res.status(500).json({message: "Internal server error ", error: error})
            })
    };
};