"use strict";

var apiMock = require('./api-mock');
var Page = require('../models/page');

function PageOps(options){
    this.client = options.client;
    this.pagesGroupTake = options.pagesGroupTake;
    this.ksetGroupTake = options.ksetGroupTake;
}

function savePagePromise(page) {
    return new Page({
        url: page.url,
        value: page.value
    }).save(null, {method: "insert"});
}

function saveKsetPromise(kset) {

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

PageOps.prototype.saveKsetByGroups = function(page) {

    var numberOfKsetGroups = apiMock.getKsetGroupsCount(page.url);
    var ksetCreationPromises = [];

    for (var i=0; i<numberOfKsetGroups; i++) {
        var pagesGroup = apiMock.getPageGroup(i, this.ksetGroupTake);
        pagesGroup.forEach(function(kset) {
            ksetCreationPromises.push(saveKsetPromise(kset));
        });
    }
    return Promise.all(ksetCreationPromises).then(function(pages){
        return pages;
    });
};



module.exports = PageOps;
