"use strict";

var apiMock = require('./api-mock');
var Pages = require('../collections/pages');
var Kset = require('../collections/kset');
var searchConsole = require('../services/search-console');
var analytics = require('../services/analytics');
var fs = require('fs');
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

PageOps.prototype.saveKsetsByPage = function(page, clientId) {
    function getKeywords (start) {
        console.log('calling')
        searchConsole.getKsetGroup(start, page, clientId).then(function(data) {
            console.log('data length response', data)
            var ksetsToSave = Kset.collections.forge(data.data.rows);
            console.log('middle')
            ksetsToSave.invokeThen('save', null).then(function() {
                console.log('all data saved');
            });
        });
    }

    getKeywords(1);
};

PageOps.prototype.savePagesByValue = function(pageSize, clientId) {
    analytics.saveTopValuePages(pageSize, clientId).then(function(data) {
        console.log('data length response', data.reports[0].data)
        var dataToSave = data.reports[0].data.rows;
        dataToSave.forEach(function(row) {
            row.dimensions = row.dimensions[0];
            row.metrics = row.metrics[0].values[0];
        });
        var pagesToSave = Pages.collections.forge(dataToSave);
        console.log('middle');
        pagesToSave.invokeThen('save', null).then(function () {
            console.log('all data saved');
        });
    });
};



module.exports = PageOps;
