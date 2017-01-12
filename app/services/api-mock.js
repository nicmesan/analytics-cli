var UUID = require('simply-uuid');
var randomWords = require('random-words')

//Private
function generateRandomPage() {
    return {
        url: "/url" + UUID.generate(),
        value: (Math.round(Math.random() * 10))
    }
};
function generateRandomKset() {
    return {
        content: randomWords({
                    min: 2,
                    max: 5,
                    join: ' '
                 })
    }
}

//Public
module.exports = {

    getPageGroupsCount: function() {
        return 2
    },

    getKsetGroupsCount: function() {
        return 3
    },

    getPageGroup: function(resultsPage, take) {
        var pageGroup = [];
        var start = resultsPage * take;
        for (var i=start; i<start+take; i++) {
            pageGroup.push(generateRandomPage());
        }
        return pageGroup;
    },

    getKsetGroup: function(resultsPage, take, page) {
        var pageGroup = [];
        var start = resultsPage * take;
        for (var i=start; i<start+take; i++) {
            pageGroup.push(generateRandomKset());
        }
        return pageGroup;
    }

};