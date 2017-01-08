var bookshelf = require('../bookshelf');

var Page = bookshelf.Model.extend({
    tableName: 'pages',
    create: function(values) {
        return new Page(values)
            .save(null, {method: "insert"});
    }
});

module.exports = Page;