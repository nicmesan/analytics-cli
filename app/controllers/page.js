var Page = require('../models/page');
var Pages = require('../collections/pages').collection;
var PageOps = require('../services/page-ops');
var analytics = require('../services/analytics');
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
        res.send(pg);
    });
};

exports.operate = function(req,res,err) {
    var pageOps = new PageOps({
        client: "Garbarino",
        pagesGroupTake: 5
    });

    pageOps.savePagesByGroups().then(function(result) {
        res.send(result)
    });
}

exports.getPages = function(req,res,err) {
    var data = req.body;


};
