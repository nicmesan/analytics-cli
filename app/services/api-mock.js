var ApiMock = {
    getPageGroupsCount: function() {
        return 3
    },
    getPageGroup: function(page, take) {
        var pageGroup = [];
        var start = page * take;
        for (var i=start; i<start+take; i++) {
            pageGroup.push({
                url: "/url" + i,
                value: (Math.round(Math.random() * 10))
            });
        }
        return pageGroup;
    }

};
module.exports = ApiMock;