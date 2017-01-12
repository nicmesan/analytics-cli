var bookshelf = require('../bookshelf');

var Kset = bookshelf.Model.extend({
    tableName: 'ksets',
    pages: function() {
        return this.belongsTo(Page);
    }
});


module.exports = Kset;