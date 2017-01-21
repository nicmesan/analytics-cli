"use strict";

var apiMock = require('./api-mock');
var Pages = require('../collections/pages');
var Kset = require('../collections/kset');
var searchConsole = require('../services/search-console');
var analytics = require('../services/analytics');
var fs = require('fs');
var Promise = require('bluebird');
var customErrors = require('./custom-errors');

function PageOps(options){
    this.client = options.client;
    this.pagesGroupTake = options.pagesGroupTake;
    this.ksetsGroupTake = options.ksetsGroupTake;
}

function savePagePromise(page) {
    return new Page({
        url: page.url,
        value: page.value
    }).save(null, {method: "insert"});
}

function formatPageRow (row) {
    return {
        pageValue: row.metrics[0].values[0],
        pagePath: row.dimensions[0]
    }
}

PageOps.prototype.savePagesByGroups = function() {

    var numberOfPageGroups = apiMock.getPageGroupsCount();
    var pageCreationPromises = [];

    for (var i=0; i<numberOfPageGroups; i++) {
        var pagesGroup = apiMock.getPageGroup(i, this.pagesGroupTake);
        pagesGroup.forEach(function(page) {
            pageCreationPromises.push(savePagePromise(page));
        });
    }
    return Promise.all(pageCreationPromises).then(function(pages){
        return pages;
    });
};

module.exports = PageOps;
