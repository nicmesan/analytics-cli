var bookshelf = require('../bookshelf');

var Page = bookshelf.Model.extend({
    tableName: 'pages'
});

module.exports = Page;