var UUID = require('simply-uuid');

//Private
function generateRandomPage() {
    return {
        url: "/url" + UUID.generate(),
        value: (Math.round(Math.random() * 10))
    }
};

//Public
module.exports = {

    getPageGroupsCount: function() {
        return 3
    },

    getKeywordGroupsCount: function() {
        return 15
    },

    getPageGroup: function(page, take) {
        var pageGroup = [];
        var start = page * take;
        for (var i=start; i<start+take; i++) {
            pageGroup.push(generateRandomPage());
        }
        return pageGroup;
    }

};