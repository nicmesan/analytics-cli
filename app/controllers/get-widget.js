var winston = require('winston');
var widget = require('../lib/widget');
var errors = require('../errors');

exports.getWidget = function (req, res, next) {
    let clientId = req.params.clientId;

    if (!clientId) {
        res.status(400).json({message: 'Include client ID'})
    }

    return widget.getKsetsForWidget(clientId)
        .then((ksets) => {
            res.set({
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods': 'GET',
            });
            res.status(200).json(ksets)
        })
        .catch((err) => {
            next(err)
        })
};
