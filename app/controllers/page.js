"use strict";

var Page = require('../models/page');
var Pages = require('../collections/pages').collection;
var PageOps = require('../services/page-ops');
var analytics = require('../services/analytics');
/*!
 * Module dependencies.
 */

exports.operate = function(req,res,err) {

    var pageOps = new PageOps({
        client: "Garbarino",
        pagesGroupTake: 10,
        ksetsGroupTake: 10
    });
    var response = '';
    var ksetForPagesPromisesList = [];

    pageOps.savePagesByGroups().then(function(pages) {
        response += 'PAGES: \n' + JSON.stringify(pages) + '\n';
        pages.forEach(function(page) {
            ksetForPagesPromisesList.push(function() {
                return pageOps.saveKsetsByGroups(page).then(function(ksetList) {
                    response+= 'KSETS for PAGE with ID ' + page.id + ':\n' +  JSON.stringify(ksetList) + '\n';
                })
            }());
        })
        return Promise.all(ksetForPagesPromisesList).then(function() {
            res.send(response);
        });
    });
}

