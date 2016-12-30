var bookshelf = require('../bookshelf');
var Page = require('../models/page');

/*!
 * Module dependencies.
 */

exports.index = function (req, res, err) {


    var Page = bookshelf.Model.extend({
        tableName: 'pages'
    });

    Page.forge({'id': 1, name: 'urlurl'}).then(function() {
        Page.where({id:1}).fetch().then(function(page) {
            console.log(page.toJSON());
        }).catch(function(err) {
            console.error(err);
        });
    });


    /*
    var Page = Bookshelf.Model.extend({
        tableName: 'page'
    });

    new Page().fetchAll()
        .then(function(pages) {
            res.send(pages.toJSON());
        })*/




};
