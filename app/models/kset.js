var bookshelf = require('../bookshelf');

var Page = bookshelf.Model.extend({
    tableName: 'ksets',
    pages: function() {
        return this.belongsTo(Page);
    }
});