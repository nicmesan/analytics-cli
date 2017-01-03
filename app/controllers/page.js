var Page = require('../models/page');
var Pages = require('../collections/pages').collection;
/*!
 * Module dependencies.
 */

exports.list = function (req, res, err) {
    new Pages().fetch({
    }).then(function(collection) {
        res.send(collection.toJSON());
    });
};

exports.create = function (req, res, err) {
    new Page({url: req.body.url })
        .save(null, {method: "insert"})
        .then(function(pg){
        res.send(pg)
    });
};



