"use strict";

var apiMock = require('./api-mock');
var Page = require('../models/page');
var Kset = require('../models/kset');

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

function saveKsetPromise(kset, page) {
    return new Kset({
        content: kset.content,
        pageId: page.id
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

PageOps.prototype.saveKsetsByGroups = function(page) {

    var numberOfKsetGroups = apiMock.getKsetGroupsCount(page.url);
    var ksetCreationPromises = [];

    for (var i=0; i<numberOfKsetGroups; i++) {
        var pagesGroup = apiMock.getKsetGroup(i, this.ksetsGroupTake, page);
        pagesGroup.forEach(function(kset) {
            ksetCreationPromises.push(saveKsetPromise(kset, page));
        });
    }
    return Promise.all(ksetCreationPromises).then(function(ksets){
        return ksets;
    });
};



module.exports = PageOps;
