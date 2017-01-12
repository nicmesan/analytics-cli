"use strict";

var apiMock = require('./api-mock');
var Page = require('../models/page');

function PageOps(options){
    this.client = options.client;
    this.pagesGroupTake = options.pagesGroupTake;
}

PageOps.prototype.partiallyPopulateUrls = function() {
    var numberOfPageGroups = apiMock.getPageGroupsCount();
    var pageCreationPromises = [];
    for (var i=0; i<numberOfPageGroups; i++) {
        var pagesGroup = apiMock.getPageGroup(i, this.pagesGroupTake);
        pagesGroup.forEach(function(page) {
            pageCreationPromises.push(function() {
                return new Page({
                    url: page.url,
                    value: page.value
                }).save(null, {method: "insert"});
            }());

        });
    }
    return Promise.all(pageCreationPromises).then(function(pages){
        return pages;
    });
};
/*
PageOps.prototype.getTopKeywordsForUrl = function(url) {

    getTopKeywordsForfor (var i=0; i<numberOfPageGroups; i++) {
        var pagesGroup = apiMock.getPageGroup(i, this.pagesGroupTake);
        console.log(pagesGroup)
        pagesGroup.forEach(function(page) {
            pageCreationPromises.push(function() {
                return new Page({
                    url: page.url,
                    value: page.value
                }).save(null, {method: "insert"});
            }());

        });
    }
    return Promise.all(pageCreationPromises).then(function(pages){
        return pages;
    });

};*/



module.exports = PageOps;
