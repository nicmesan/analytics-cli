"use strict";

var apiMock = require('./api-mock');
var Page = require('../models/page');
var Kset = require('../collections/kset');
var searchConsole = require('../services/search-console');

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

function saveKsetPromise(ksets) {
    console.log('saving', ksets.rows.length)
    var ksetsToSave = Kset.collections.forge(ksets.rows);
    ksetsToSave.invokeThen('save', null).then(function() {
        console.log('all data saved');
    });
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
    var counter = 0;
    function getKeywords (start) {
        console.log('calling')
        searchConsole.getKsetGroup(start, page, clientId).then(function(data) {
            console.log('data length response', data.rows.length)
            var ksetsToSave = Kset.collections.forge(data.rows);
            ksetsToSave.invokeThen('save', null).then(function() {
                console.log('all data saved');
                if (data.rows.length === 5000) {
                    counter ++;
                    getKeywords(5000*counter);
                }
            });
        });
    }

    getKeywords(1);
};



module.exports = PageOps;
